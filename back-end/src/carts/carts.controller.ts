import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  Param,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findMyCart(@Req() req) {
    return this.cartsService.findOne(req.user_id);
  }

  @Patch()
  addCartDetail(@Req() req, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.addCartDetail(req.user_id, updateCartDto);
  }

  @Patch('update')
  update(@Req() req, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(req.user_id, updateCartDto);
  }

  @Delete('detail/:id')
  removeDetail(@Param('id') id: number) {
    return this.cartsService.removeDetail(+id);
  }

  @Delete('clear')
  clearCart(@Req() req) {
    return this.cartsService.clearCartByUser(req.user_id);
  }
}