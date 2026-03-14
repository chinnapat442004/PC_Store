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

    const cartDetail = new CartDetail();
    cartDetail.price = createCartDto.product.price * createCartDto.quantity;

    cartDetail.quantity = createCartDto.quantity;
    cartDetail.product = createCartDto.product;
    cartDetail.cart = cart;
    await this.cartDetailRepository.save(cartDetail);

    cart.total_amount += cartDetail.price;

    return await this.cartRepository.save(cart);
  }

  async addCartDetail(cart_id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { cart_id },
      relations: ['cartDetails', 'cartDetails.product'],
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingDetail = cart.cartDetails.find(
      (detail) =>
        detail.product.product_id === updateCartDto.product.product_id,
    );

    if (existingDetail) {
      // กรณีสินค้าซ้ำ
      existingDetail.quantity += updateCartDto.quantity;
      existingDetail.price =
        existingDetail.quantity * existingDetail.product.price;

      await this.cartDetailRepository.save(existingDetail);
    } else {
      const newCartDetail = this.cartDetailRepository.create({
        cart,
        product: updateCartDto.product,
        quantity: updateCartDto.quantity,
        price: updateCartDto.quantity * updateCartDto.product.price,
      });

      await this.cartDetailRepository.save(newCartDetail);

      cart.cartDetails.push(newCartDetail);
    }

    cart.total_amount = cart.cartDetails.reduce(
      (sum, detail) => sum + detail.price,
      0,
    );

    return await this.cartRepository.save(cart);
  }

  async update(cart_id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { cart_id },
      relations: ['cartDetails', 'cartDetails.product'],
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const detail = cart.cartDetails.find(
      (detail) =>
        detail.product.product_id === updateCartDto.product.product_id,
    );

    if (detail) {
      detail.quantity = updateCartDto.quantity;
      detail.price = detail.quantity * detail.product.price;

      await this.cartDetailRepository.save(detail);
    }

    cart.total_amount = cart.cartDetails.reduce(
      (sum, detail) => sum + detail.price,
      0,
    );

    return await this.cartRepository.save(cart);
  }

  async findAll() {
    const carts = await this.cartRepository.find({
      relations: {
        cartDetails: {
          product: { images: true },
        },
        user: true,
      },
    });

    carts.forEach((cart) => {
      cart.cartDetails.sort((a, b) => a.cart_detail_id - b.cart_detail_id);
    });

    return carts;
  }

  async findOne(user_id: number) {
    return await this.cartRepository.findOne({
      where: {
        user: { user_id },
      },
      relations: {
        cartDetails: {
          product: { images: true },
        },
        user: true,
      },
    });
  }

  async removeDetail(cart_detail_id: number) {
    console.log(cart_detail_id);

    const cartDetail = await this.cartDetailRepository.findOne({
      where: { cart_detail_id },
      relations: ['cart', 'cart.cartDetails'],
    });

    if (!cartDetail) {
      throw new Error('Cart detail not found');
    }

    const cart = cartDetail.cart;

    cart.cartDetails = cart.cartDetails.filter(
      (detail) => detail.cart_detail_id !== cart_detail_id,
    );

    cart.total_amount = cart.cartDetails.reduce(
      (sum, detail) => sum + detail.price,
      0,
    );

    await this.cartDetailRepository.remove(cartDetail);

    return await this.cartRepository.save(cart);
  }
}
