import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrderStatus, PaymentMethod } from './emums/order-status.enum';
import { OrderDetail } from './entities/order-detail';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Address } from 'src/address/entities/address.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { Shipment } from 'src/shipment/entities/shipment.entity';


@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) { }

  private getDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }


  async create(createOrderDto: CreateOrderDto, user_id: number) {
    return this.dataSource.transaction(async (manager) => {
      const address = await manager.findOne(Address, {
        where: {
          user: { user_id },
          is_default: true,
        },
      });

      if (!address) throw new BadRequestException('No default address');
      if (!createOrderDto.details?.length)
        throw new BadRequestException('No order details');
      if (!address.lat || !address.lng)
        throw new BadRequestException('Address has no location');

      const branches = await manager.find(Branch);
      if (!branches.length)
        throw new BadRequestException('No branches found');

      let nearestBranch = branches[0];
      let minDistance = Infinity;

      for (const branch of branches) {
        if (!branch.lat || !branch.lng) continue;

        const distance = this.getDistance(
          address.lat,
          address.lng,
          branch.lat,
          branch.lng,
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestBranch = branch;
        }
      }


      let total = 0;

      const products = await Promise.all(
        createOrderDto.details.map(async (item) => {
          const product = await manager.findOne(Product, {
            where: { product_id: item.product_id },
            relations: { images: true },
          });

          if (!product) {
            throw new NotFoundException(
              `Product ${item.product_id} not found`,
            );
          }

          total += product.price * item.quantity;
          return { product, quantity: item.quantity };
        }),
      );


      const user = await manager.findOne(User, {
        where: { user_id },
      });


      const order = new Order();
      order.user = user;
      order.branch = nearestBranch;
      order.payment_method = createOrderDto.payment_method;
      order.fullname = address.fullname;
      order.phone = address.phone;
      order.address_detail = address.address_detail;
      order.sub_district = address.sub_district;
      order.district = address.district;
      order.province = address.province;
      order.zipcode = address.zipcode;
      order.subtotal = total
      order.discount_amount = 0
      order.total_amount = order.subtotal - order.discount_amount;


      if (createOrderDto.payment_method === PaymentMethod.PROMPTPAY) {
        order.order_status = OrderStatus.PENDING;
      } else if (createOrderDto.payment_method === PaymentMethod.COD) {
        order.order_status = OrderStatus.CONFIRMED;
      }

      const savedOrder = await manager.save(order);


      const details = products.map(({ product, quantity }) => {
        const detail = new OrderDetail();
        detail.product_id = product.product_id;
        detail.quantity = quantity;
        detail.price = product.price;
        detail.product_title = product.title;
        detail.product_image = product.images[0]?.image;

        detail.order = savedOrder;
        return detail;
      });

      await manager.save(details);

      const history = new OrderStatusHistory();
      history.order_id = savedOrder.order_id;
      history.status = order.order_status;
      history.user_id = user_id;

      await manager.save(history);


      if (createOrderDto.payment_method === PaymentMethod.PROMPTPAY) {
        const payment = new Payment();
        payment.order_id = savedOrder.order_id;
        payment.amount = order.total_amount;
        await manager.save(payment);
      }

      return savedOrder;
    });
  }

  async findAll(page: number, limit: number, order_status?: OrderStatus | OrderStatus[]) {
    const skip = (page - 1) * limit;

    let where = {}

    if (order_status) {
      where = Array.isArray(order_status)
        ? { order_status: In(order_status) }
        : { order_status }
    }

    const [data, total] = await this.orderRepository.findAndCount({
      where,
      relations: {
        details: true,
        shipment: true
      },
      order: {
        created_at: 'DESC',
      },
      skip,
      take: limit,
    });


    const rawCounts = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.order_status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.order_status')
      .getRawMany()


    const counts = rawCounts.reduce((acc, item) => {
      acc[item.status] = Number(item.count)
      return acc
    }, {} as Record<OrderStatus, number>)

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit), counts,
    };
  }

  async findOne(order_id: number) {
    const order = await this.orderRepository.findOne({
      where: { order_id },
      relations: {
        details: true,
        shipment: true, orderHistory: true

      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }


  async updateStatus(
    order_id: number,
    updateDto: UpdateOrderStatusDto,
    userId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { order_id },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const currentStatus = order.order_status;

      if (currentStatus === updateDto.status) {
        throw new BadRequestException('Status is already this value');
      }


      this.validateTransition(currentStatus, updateDto.status);


      order.order_status = updateDto.status;
      await manager.save(order);


      const history = new OrderStatusHistory();
      history.order_id = order_id;
      history.status = updateDto.status;
      history.user_id = userId;

      await manager.save(history);

      return { message: 'Status updated successfully' };
    });
  }



  async updateTracking(
    order_id: number,
    updateDto: UpdateTrackingDto,
    userId: number,
  ) {


    return this.dataSource.transaction(async (manager) => {


      const order = await manager.findOne(Order, {
        where: { order_id }, relations: { shipment: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }


      if (order.order_status !== OrderStatus.PICKING) {
        throw new BadRequestException('Order is not in picking state');
      }


      if (!updateDto.tracking_number || !updateDto.shipment_id) {
        throw new BadRequestException('Tracking info required');
      }

      order.order_status = OrderStatus.SHIPPED;
      order.tracking_number = updateDto.tracking_number
      const shipment = await manager.findOne(Shipment, {
        where: { shipment_id: updateDto.shipment_id },
      })

      if (!shipment) {
        throw new NotFoundException('Shipment not found')
      }

      order.shipment = shipment
      await manager.save(order);

      const history = new OrderStatusHistory();
      history.order_id = order_id;
      history.status = OrderStatus.SHIPPED;
      history.user_id = userId;

      await manager.save(history);

      return { message: 'Order shipped successfully' };
    });
  }

  private validateTransition(current: OrderStatus, next: OrderStatus) {
    const flow = {
      pending: ['waiting_verify', 'cancelled'],
      waiting_verify: ['confirmed', 'cancelled'],
      confirmed: ['picking'],
      picking: ['shipped'],
      shipped: ['done'],
      done: [],
      cancelled: [],
    };

    if (!flow[current]?.includes(next)) {
      throw new BadRequestException(
        `Invalid transition: ${current} → ${next}`,
      );
    }
  }
}