import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderDetail } from './orders/entities/order_detail';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // เปลี่ยนเป็น sqlite

      database: 'database.sqlite', // ไฟล์ฐานข้อมูล SQLite
      entities: [User, Order, OrderDetail],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    AuthModule,
    OrdersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
