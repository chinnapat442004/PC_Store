import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const order = new Order();
    order.orderDetail = [];
    order.total_amount = 0;

    const lastOrder = await this.orderRepository.findOne({
      where: {},
      order: { stripe_payment_id: 'DESC' },
    });
    console.log(lastOrder);
    if (lastOrder && lastOrder.stripe_payment_id) {
      const lastIdNumber = parseInt(
        lastOrder.stripe_payment_id.split('_')[1],
        10,
      );
      order.stripe_payment_id = `stripe_${lastIdNumber + 1}`;
    } else {
      order.stripe_payment_id = 'stripe_1';
    }

    order.user = createOrderDto.user;

    for (const item of createOrderDto.orderDetail) {
      const orderDetail = new OrderDetail();
      orderDetail.price = item.product.price;
      orderDetail.quantity = item.quantity;
      orderDetail.product = item.product;

      await this.orderDetailRepository.save(orderDetail);
      order.orderDetail.push(orderDetail);
      order.total_amount += orderDetail.price * orderDetail.quantity;
      order.order_status = createOrderDto.order_status;
      order.status = createOrderDto.status;
      order.currency = createOrderDto.currency;
    }

    return this.orderRepository.save(order);
  }

  findAll() {
    return this.orderRepository.find({
      relations: {
        orderDetail: { product: true },
        user: true,
      },
    });
  }

  findOne(order_id: number) {
    return this.orderRepository.findOne({
      where: { order_id },
      relations: { orderDetail: true, user: true },
    });
  }
}
