import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AdminDashboardService } from './admin/admin-dashboard.service';
import { OrdersModule } from 'src/orders/orders.module';

import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/user.module';
import { CouponModule } from 'src/coupon/coupon.module';
import { ManagerDashboardService } from './manager/manager-dashboard.service';
import { StockModule } from 'src/stock/stock.module';
import { StaffDashboardService } from './staff/staff-dashboard.service';

@Module({
  imports: [
    OrdersModule,
    UsersModule,
    CouponModule,
    ProductsModule,
    StockModule,
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    AdminDashboardService,
    ManagerDashboardService,
    StaffDashboardService,
  ],
})
export class DashboardModule {}
