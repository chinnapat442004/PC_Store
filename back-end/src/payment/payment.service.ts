import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

import { StorePaymentConfigService } from 'src/store-payment-config/store-payment-config.service';

import * as qrcode from 'qrcode';
import * as generatePayload from 'promptpay-qr';
import { Order } from 'src/orders/entities/order.entity';
import { OrderStatus, PaymentMethod } from 'src/orders/emums/order-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly configService: StorePaymentConfigService,
  ) { }

  create(createPaymentDto: CreatePaymentDto) {
    const newPayment = this.paymentRepo.create(createPaymentDto);
    return this.paymentRepo.save(newPayment);
  }


  findAll() {
    return this.paymentRepo.find({
      relations: ['order'],
      order: { created_at: 'DESC' }
    });
  }

  async findByOrderId(orderId: number) {
    const payment = await this.paymentRepo.findOne({
      where: {
        order: {
          order_id: orderId,
        },
      },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('ไม่พบข้อมูลการชำระเงินจากออเดอร์นี้');
    }

    return payment;
  }


  async getPaymentInfo(orderId: number) {

    const payment = await this.paymentRepo.findOne({
      where: {
        order: { order_id: orderId }
      },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const order = payment.order;

    const config = await this.configService.getConfig();

    if (order.payment_method === PaymentMethod.PROMPTPAY) {
      const amount = Number(order.total_amount);

      const payload = generatePayload(
        config.promptpay_number,
        { amount }
      );

      const qr = await qrcode.toDataURL(payload);

      return {
        payment_id: payment.payment_id,
        order_id: order.order_id,
        amount: order.total_amount,
        qr_image: qr,
        promptpay_number: config.promptpay_number,
        account_name: config.account_name,
      };
    }

    return {
      payment_id: payment.payment_id,
      order_id: order.order_id,
      amount: order.total_amount,
    };
  }

  async uploadSlip(paymentId: number, slipImage: string) {
    const payment = await this.paymentRepo.findOne({
      where: { payment_id: paymentId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }


    payment.slip_image = slipImage;



    if (payment.order) {

      payment.order.order_status = await OrderStatus.WAITING_VERIFY;
    }


    await this.orderRepo.save(payment.order);
    await this.paymentRepo.save(payment);


    return {
      message: 'Slip uploaded successfully',
      payment_id: payment.payment_id,

      order_status: payment.order?.order_status,
    };
  }
}