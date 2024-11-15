import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetail } from './entities/cart_detail';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartDetail])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
