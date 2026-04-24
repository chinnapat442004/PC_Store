import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Image } from './entities/image.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image, Branch, Stock])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
