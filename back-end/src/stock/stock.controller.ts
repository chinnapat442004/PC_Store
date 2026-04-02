import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateStockDto } from './dto/create-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

 @Get()
getStock(
  @Query('product_id') product_id?: number,
  @Query('branch_id') branch_id?: number,
) {
  return this.stockService.getStock(product_id, branch_id);
}

  @Post()
createStock(@Body() dto: CreateStockDto) {
  return this.stockService.createStock(dto);
}

  @Post('update')
  updateStock(@Body() dto: UpdateStockDto) {
    return this.stockService.updateStock(dto);
  }

  @Get('movement')
  getMovement(@Query('product_id') product_id: number) {
    return this.stockService.getMovement(product_id);
  }
}