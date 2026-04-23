import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';


import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Get()
  getStock(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
  ) {
    console.log("ทดสอบ", req.user.branch_id)
    return this.stockService.getStock(req.user.branch_id, +page,
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
  getMovement(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
  ) {
    return this.stockService.getMovement(

      req.user.branch_id,
      +page,
      +limit, search
    )
  }
}