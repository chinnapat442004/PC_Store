import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Post('apply-coupon')
  applyCoupon(
    @Req() req,
    @Body() body: ApplyCouponDto,
  ) {



    return this.cartsService.applyCoupon(req.user.user_id, body.code);
  }

  @Get()
  findMyCart(@Req() req) {
    console.log(req.user)
    return this.cartsService.findOne(req.user.user_id);
  }

  @Patch()
  addCartDetail(@Req() req, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.addCartDetail(req.user.user_id, updateCartDto);
  }

  @Patch('update')
  update(@Req() req, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(req.user.user_id, updateCartDto);
  }

  @Delete('detail/:id')
  removeDetail(@Param('id') id: number) {
    return this.cartsService.removeDetail(+id);
  }

  @Delete('clear')
  clearCart(@Req() req) {
    return this.cartsService.clearCartByUser(req.user.user_id);
  }

  @Delete('remove-coupon')
  async removeCoupon(@Req() req) {
    return this.cartsService.removeCoupon(req.user.user_id);
  }
}