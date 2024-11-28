import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartDetail } from './entities/cart_detail';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail)
    private cartDetailRepository: Repository<CartDetail>,
  ) {}
  async create(createCartDto: CreateCartDto) {
    const cart = new Cart();
    cart.user = createCartDto.user;
    cart.total_amount = 0;
    await this.cartRepository.save(cart);

    for (const item of createCartDto.cartDetails) {
      const cartDetail = new CartDetail();
      cartDetail.price = item.product.price * item.quantity;
      console.log(item.product.price);
      console.log(item.quantity);
      cartDetail.quantity = item.quantity;
      cartDetail.product = item.product;
      cartDetail.cart = cart;
      await this.cartDetailRepository.save(cartDetail);

      cart.total_amount += cartDetail.price;
    }

    return await this.cartRepository.save(cart);
  }

  async findAll() {
    return await this.cartRepository.find({
      relations: { cartDetails: { product: { images: true } }, user: true },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} cart`;
  // }

  // update(id: number, updateCartDto: UpdateCartDto) {
  //   return `This action updates a #${id} cart`;
  // }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
