import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
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
import { ConfigModule } from '@nestjs/config';
import { BrandsModule } from './brands/brands.module';
import { Brand } from './brands/entities/brand.entity';
import { StockModule } from './stock/stock.module';
import { Stock } from './stock/entities/stock.entity';
@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
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
        Brand,Stock
      ],
    }),
  
    BranchsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    ProductsModule,
    CategoriesModule,
    CartsModule,
    BrandsModule,
    StockModule
   
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
