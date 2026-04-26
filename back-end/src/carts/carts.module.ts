import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetail } from './entities/cart_detail';
import { Cart } from './entities/cart.entity';
import { Coupon } from 'src/coupon/entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartDetail, Coupon])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule { }
