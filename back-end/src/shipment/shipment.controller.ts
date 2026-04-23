import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) { }

  @Post()
  create(@Body() body: CreateShipmentDto) {
    return this.shipmentService.create(body);
  }


  @Get()
  findAll(@Query('search') search?: string) {
    return this.shipmentService.findAll(search);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.findOne(id);
  }


  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateShipmentDto,
  ) {
    return this.shipmentService.update(id, body);
  }


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.remove(id);
  }
}