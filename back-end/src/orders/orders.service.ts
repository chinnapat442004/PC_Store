import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, EntityManager } from 'typeorm';

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
import { Stock } from 'src/stock/entities/stock.entity';
import { Coupon } from 'src/coupon/entities/coupon.entity';
import { Cart } from 'src/carts/entities/cart.entity';



@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,


  ) { }


  //หาสาขาที่ใกล้ที่สุด
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


  private async findBranchWithStock(
    branches: Branch[],
    lat: number,
    lng: number,
    manager: EntityManager,
    productItems: { product_id: number; quantity: number }[],
  ) {
    const sortedBranches = branches
      .map((b) => ({
        branch: b,
        distance: this.getDistance(lat, lng, b.lat, b.lng),
      }))
      .sort((a, b) => a.distance - b.distance)

    for (const item of sortedBranches) {
      let allStockEnough = true

      for (const product of productItems) {
        const stock = await manager.findOne(Stock, {
          where: {
            product_id: product.product_id,
            branch_id: item.branch.branch_id,
          },
        })

        if (!stock || stock.quantity < product.quantity) {
          allStockEnough = false
          break
        }
      }

      if (allStockEnough) {
        return item.branch
      }
    }

    return null
  }

  async create(createOrderDto: CreateOrderDto, user_id: number) {

    return this.dataSource.transaction(async (manager) => {

      const cart = await manager.findOne(Cart, {
        where: { user: { user_id } },
        relations: [
          'cartDetails',
          'cartDetails.product',
          'cartDetails.product.images',
        ]
      });
      console.log(cart)



      const address = await manager.findOne(Address, {
        where: {
          user: { user_id },
          is_default: true,
        },
      });

      if (!address) throw new BadRequestException('No default address');
      if (!cart.cartDetails.length)
        throw new BadRequestException('No order details');
      if (!address.lat || !address.lng)
        throw new BadRequestException('Address has no location');

      const branches = await manager.find(Branch);
      if (!branches.length)
        throw new BadRequestException('No branches found');


      const productItems = cart.cartDetails.map((d) => ({
        product_id: d.product.product_id,
        quantity: d.quantity,
      }));

      const nearestBranch = await this.findBranchWithStock(
        branches,
        address.lat,
        address.lng,
        manager,
        productItems,
      );

      if (!nearestBranch) {
        throw new BadRequestException('สินค้าหมดทุกสาขา');
      }

      let total = 0;

      const products = await Promise.all(
        cart.cartDetails.map(async (item) => {
          const product = await manager.findOne(Product, {
            where: { product_id: item.product.product_id },
            relations: { images: true },
          });

          if (!product) {
            throw new NotFoundException(`Product ${item.product.product_id} not found`);
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
      order.subtotal = total;

      if (createOrderDto.coupon_code) {

        const coupon = await manager.findOne(Coupon, {
          where: { code: createOrderDto.coupon_code },
        });

        // 1. ตรวจสอบสถานะคูปอง 
        if (!coupon) throw new BadRequestException('ไม่สามารถใช้โค้ดนี้ได้');

        const now = new Date();
        if (now < coupon.start_date || now > coupon.end_date) {
          throw new BadRequestException('โค้ดส่วนลดนี้หมดอายุแล้วหรือไม่สามารถใช้ได้ในขณะนี้');
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
          throw new BadRequestException('โค้ดส่วนลดถูกใช้งานครบแล้ว');
        }

        if (coupon.min_order && total < coupon.min_order) {
          throw new BadRequestException('ยอดสั่งซื้อไม่ถึงขั้นต่ำ');
        }


        let discount = 0;
        if (coupon.discount_type === 'percent') {
          discount = total * (coupon.discount_value / 100);
          if (coupon.max_discount) {
            discount = Math.min(discount, coupon.max_discount);
          }
        } else {
          // ส่วนลดแบบเงินสด (fixed)
          discount = coupon.discount_value;
        }

        // ป้องกันส่วนลดเกินราคาสินค้า
        discount = Math.min(discount, total);
        discount = Number(discount.toFixed(2));



        // 3. บันทึกข้อมูลส่วนลดลงใน Order
        order.coupon_code = coupon.code;
        order.discount_type = coupon.discount_type;
        order.discount_value = coupon.discount_value;
        order.discount_amount = discount;
        order.total_amount = total - discount;

        // 4. อัปเดตจำนวนครั้งที่คูปองถูกใช้งาน
        coupon.used_count += 1;
        await manager.save(coupon);
      } else {
        order.total_amount = total
      }

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

      for (const item of cart.cartDetails) {
        const stock = await manager.findOne(Stock, {
          where: {
            product_id: item.product.product_id,
            branch_id: nearestBranch.branch_id,
          },
        });

        if (stock) {
          stock.quantity -= item.quantity;
          await manager.save(stock);
        }
      }

      if (createOrderDto.payment_method === PaymentMethod.PROMPTPAY) {
        const payment = new Payment();
        payment.order_id = savedOrder.order_id;
        payment.amount = order.total_amount;
        await manager.save(payment);
      }



      return savedOrder;
    });
  }

  async findAll(page: number, limit: number, order_status?: OrderStatus | OrderStatus[], branch_id?: number) {
    const skip = (page - 1) * limit;

    let where = {}

    if (order_status || branch_id) {
      where = {
        ...(order_status && (Array.isArray(order_status)
          ? { order_status: In(order_status) }
          : { order_status })),

        ...(branch_id && {
          branch: {
            branch_id: branch_id,
          },
        }),
      }
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

  async findOne(order_id: number, branch_id?: number) {
    const order = await this.orderRepository.findOne({
      where: {
        order_id,
        ...(branch_id && {
          branch: {
            branch_id,
          },
        }),
      },
      relations: {
        details: true,
        shipment: true,
        orderHistory: true,
        branch: true,
      },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    return order
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




  // รายได้ของ วันนี้"(order ที่สำเร็จ)
  async getTodayRevenue() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const result = await this.orderRepository
      .createQueryBuilder('orders')
      .select('SUM(orders.total_amount)', 'revenue')
      .where('orders.order_status = :status', { status: OrderStatus.DONE })
      .andWhere('orders.created_at BETWEEN :start AND :end', {
        start,
        end,
      })
      .getRawOne();

    return Number(result.revenue || 0);
  }


  // รายได้ของ เดือนปัจจุบัน ( order ที่สำเร็จ)
  async getMonthlyRevenue() {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    const result = await this.orderRepository
      .createQueryBuilder('orders')
      .select('SUM(orders.total_amount)', 'revenue')
      .where('orders.order_status = :status', { status: OrderStatus.DONE })
      .andWhere('orders.created_at BETWEEN :start AND :end', {
        start,
        end,
      })
      .getRawOne();
    return Number(result.revenue || 0);
  }


  // นับจำนวนออเดอร์ทั้งหมด / สำเร็จ / ยกเลิก
  async getTotalOrders() {
    const total = await this.orderRepository.count();
    const success = await this.orderRepository.count({
      where: { order_status: OrderStatus.DONE },
    });
    const cancelled = await this.orderRepository.count({
      where: { order_status: OrderStatus.CANCELLED },
    });
    return { total, success, cancelled };
  }


  // รายได้ย้อนหลัง 7 วัน 
  async getSalesLast7Days() {
    return this.orderRepository
      .createQueryBuilder('o')
      .select("DATE(o.created_at)", "date")
      .addSelect("SUM(o.total_amount)", "revenue")
      .where("o.order_status = :status", { status: OrderStatus.DONE })
      .andWhere("o.created_at >= NOW() - INTERVAL '7 days'")
      .groupBy("DATE(o.created_at)")
      .orderBy("date", "ASC")
      .getRawMany();
  }


  // รายได้แยกตามหมวดหมู่ 
  async getSalesByCategory() {
    const raw = await this.orderRepository
      .createQueryBuilder('o')
      .innerJoin('o.details', 'd')
      .innerJoin(Product, 'p', 'p.product_id = d.product_id')
      .innerJoin('p.category', 'c')
      .select('c.name', 'category')
      .addSelect('SUM(d.quantity * d.price)', 'revenue')
      .where('o.order_status = :status', { status: OrderStatus.DONE })
      .groupBy('c.name')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    const top5 = raw.slice(0, 5);
    const others = raw.slice(5).reduce((sum, item) => {
      return sum + Number(item.revenue);
    }, 0);

    if (others > 0) {
      top5.push({
        category: 'อื่นๆ',
        revenue: others,
      });
    }

    return top5;
  }


  // สินค้าขายดี (เรียงตามจำนวนที่ขายได้)
  async getTopProducts(limit = 5) {
    return this.orderRepository
      .createQueryBuilder('o')
      .innerJoin('o.details', 'd')
      .innerJoin(Product, 'p', 'p.product_id = d.product_id')
      .select('p.product_id', 'productId')
      .addSelect('p.title', 'name')
      .addSelect('SUM(d.quantity)', 'sold')
      .where('o.order_status = :status', { status: OrderStatus.DONE })
      .groupBy('p.product_id')
      .addGroupBy('p.title')
      .orderBy('sold', 'DESC')
      .limit(limit)
      .getRawMany();
  }

}

