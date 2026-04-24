import { Module } from '@nestjs/common';
import { BranchsService } from './branchs.service';
import { BranchsController } from './branchs.controller';
import { Branch } from './entities/branch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from 'src/stock/entities/stock.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Product, Stock])],
  controllers: [BranchsController],
  providers: [BranchsService],
})
export class BranchsModule { }
