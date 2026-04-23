import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

import { Order } from 'src/orders/entities/order.entity';

import { StorePaymentConfigModule } from 'src/store-payment-config/store-payment-config.module';


@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order,]), StorePaymentConfigModule,],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
