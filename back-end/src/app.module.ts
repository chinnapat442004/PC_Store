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
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { Image } from './products/entities/image.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/entities/cart.entity';
import { CartDetail } from './carts/entities/cart_detail';
import { BranchsModule } from './branches/branchs.module';
import { Branch } from './branches/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // เปลี่ยนเป็น sqlite

      database: 'database.sqlite', // ไฟล์ฐานข้อมูล SQLite
      entities: [
        User,
        Branch,
        Order,
        OrderDetail,
        Product,
        Category,
        Cart,
        CartDetail,
        Image,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    BranchsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    ProductsModule,
    CategoriesModule,
    CartsModule,
    BranchsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
