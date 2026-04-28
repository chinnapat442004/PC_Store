import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AdminDashboardService } from './admin/admin-dashboard.service';
import { OrdersModule } from 'src/orders/orders.module';

import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/user.module';
import { CouponModule } from 'src/coupon/coupon.module';


@Module({
  imports: [
    OrdersModule,
    UsersModule,
    CouponModule,
    ProductsModule,

  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    AdminDashboardService,

  ],
})
export class DashboardModule { }