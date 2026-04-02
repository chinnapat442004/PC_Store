import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './entities/stock.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { CreateStockDto } from './dto/create-stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,

    @InjectRepository(StockMovement)
    private movementRepo: Repository<StockMovement>,

    private dataSource: DataSource,
  ) {}


  async createStock(dto: CreateStockDto) {
  const { product_id, branch_id, quantity } = dto;

  const exist = await this.stockRepo.findOne({
    where: { product_id, branch_id },
  });

  if (exist) {
    throw new BadRequestException('Stock already exists');
  }

  const stock = this.stockRepo.create({
    product_id,
    branch_id,
    quantity,
  });

  return this.stockRepo.save(stock);
}

  async getStock(product_id?: number, branch_id?: number) {
  if (product_id && branch_id) {
    return this.stockRepo.findOne({
      where: { product_id, branch_id },
    });
  }

  if (branch_id) {
    return this.stockRepo.find({
      where: { branch_id },
    });
  }

  return this.stockRepo.find(); 
}

  async updateStock(dto: UpdateStockDto) {
    const { product_id, branch_id, quantity, type, ref_id, note } = dto;

    return this.dataSource.transaction(async (manager) => {
      let stock = await manager.findOne(Stock, {
        where: { product_id, branch_id },
      });

      if (!stock) {
        stock = manager.create(Stock, {
          product_id,
          branch_id,
          quantity: 0,
        });
      }

      const newQty = stock.quantity + quantity;

      if (newQty < 0) {
        throw new BadRequestException('Stock not enough');
      }

      stock.quantity = newQty;

      await manager.save(stock);

      const movement = manager.create(StockMovement, {
        product_id,
        branch_id,
        change_qty: quantity,
        type,
        ref_id,
        note,
      });

      await manager.save(movement);

      return stock;
    });
  }

  async getMovement(product_id: number) {
    return this.movementRepo.find({
      where: { product_id },
      order: { created_at: 'DESC' },
    });
  }
}