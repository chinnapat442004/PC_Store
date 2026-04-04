import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';

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


  

async getStock(
 
  branch_id: number,
  page: number = 1,
  limit: number = 10,
  search?: string,
) {
  const skip = (page - 1) * limit

  const qb = this.stockRepo
    .createQueryBuilder('stock')
    .leftJoinAndSelect('stock.product', 'product')
    .leftJoinAndSelect('product.images', 'images')
    .where('stock.branch_id = :branch_id', { branch_id })


  if (search) {
    qb.andWhere('LOWER(product.title) LIKE LOWER(:search)', {
      search: `%${search}%`,
    })
  }


  qb.skip(skip).take(limit)


  qb.orderBy('stock.updated_at', 'DESC')

  const [stocks, total] = await qb.getManyAndCount()

  const data = stocks.map((stock) => {
    let stockStatus = 'in stock'
    if (stock.quantity === 0) {
      stockStatus = 'out of stock'
    } else if (stock.quantity <= 5) {
      stockStatus = 'low stock'
    }

    return {
      id: stock.id,
      quantity: stock.quantity,
      updated_at: stock.updated_at,
      product_id: stock.product.product_id,
      product_title: stock.product.title,
      product_price: stock.product.price,
      image: stock.product.images?.[0]?.image ?? null, 
      status_label: stockStatus,
    }
  })

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  }
}
async updateStock(dto: UpdateStockDto) {
  const { product_id, branch_id, quantity, note } = dto

  return this.dataSource.transaction(async (manager) => {
    const stock = await manager.findOne(Stock, {
      where: { product_id, branch_id },
    })

    if (!stock) {
      throw new BadRequestException('Stock not found')
    }


    const diff = quantity - stock.quantity

    if (stock.quantity + diff < 0) {
      throw new BadRequestException('Stock not enough')
    }

   
    stock.quantity = quantity
    await manager.save(stock)

   
    await manager.save(
      manager.create(StockMovement, {
        product_id,
        branch_id,
        change_qty: diff,
        type: diff >= 0 ? 'IN' : 'OUT',
        note: note ,
      }),
    )

    return stock
  })
}

  async getMovement(product_id: number) {
    return this.movementRepo.find({
      where: { product_id },
      order: { created_at: 'DESC' },
    });
  }
}