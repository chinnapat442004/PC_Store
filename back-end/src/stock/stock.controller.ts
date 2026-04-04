import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateStockDto } from './dto/create-stock.dto';

import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

@Get()
getStock(
  @Req() req,
   @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
  @Query('search') search: string,
) {

  return this.stockService.getStock(req.user.branch_id,+page,
        +limit,
        search,)
}

 @Post('update')
updateStock(
  @Req() req,
  @Body() dto: UpdateStockDto
) {
  const branch_id = req.user.branch_id

  return this.stockService.updateStock({
    ...dto,
    branch_id, 
  })
}
  @Get('movement')
  getMovement(@Query('product_id') product_id: number) {
    return this.stockService.getMovement(product_id);
  }
}