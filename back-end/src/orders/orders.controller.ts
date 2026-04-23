import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrderStatus } from './emums/order-status.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }


  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req,) {

    return this.ordersService.create(dto, req.user.user_id)
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll(+page, +limit, status);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }


  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req,
  ) {
    const userId = req.user.user_id || 0;

    return this.ordersService.updateStatus(id, dto, userId);
  }

  @Patch(':id/tracking')
  updateTracking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrackingDto,
    @Req() req,
  ) {

    const userId = req.user.user_id || 0;

    return this.ordersService.updateTracking(id, dto, userId);
  }
}