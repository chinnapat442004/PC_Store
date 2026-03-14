import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':user_id')
  findOne(@Param('user_id') id: string) {
    return this.cartsService.findOne(+id);
  }

  @Patch(':id')
  addCartDetail(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.addCartDetail(+id, updateCartDto);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.removeDetail(+id);
  }
}
