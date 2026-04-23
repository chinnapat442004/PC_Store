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
  ) { }

  async create(createCartDto: CreateCartDto) {
    let cart = await this.cartRepository.findOne({
      where: { user: { user_id: createCartDto.user.user_id } },
      relations: ['cartDetails', 'cartDetails.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: createCartDto.user,
        subtotal: 0,
        total: 0,
        cartDetails: [],
      });
      cart = await this.cartRepository.save(cart);
    }

    const cartDetail = this.cartDetailRepository.create({
      product: createCartDto.product,
      quantity: createCartDto.quantity,
      price: createCartDto.product.price * createCartDto.quantity,
      cart,
    });

    await this.cartDetailRepository.save(cartDetail);

    cart.subtotal += cartDetail.price;
    cart.total = cart.subtotal;

    return this.cartRepository.save(cart);
  }

  async addCartDetail(user_id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { user: { user_id } },
      relations: ['cartDetails', 'cartDetails.product'],
    });

    if (!cart) throw new Error('Cart not found');

    const existingDetail = cart.cartDetails.find(
      (d) => d.product.product_id === updateCartDto.product.product_id,
    );

    if (existingDetail) {
      existingDetail.quantity += updateCartDto.quantity;
      existingDetail.price =
        existingDetail.quantity * existingDetail.product.price;

      await this.cartDetailRepository.save(existingDetail);
    } else {
      const newDetail = this.cartDetailRepository.create({
        cart,
        product: updateCartDto.product,
        quantity: updateCartDto.quantity,
        price: updateCartDto.quantity * updateCartDto.product.price,
      });

      await this.cartDetailRepository.save(newDetail);
      cart.cartDetails.push(newDetail);
    }

    cart.subtotal = cart.cartDetails.reduce((s, d) => s + d.price, 0);
    cart.total = cart.subtotal;

    return this.cartRepository.save(cart);
  }

  async update(user_id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { user: { user_id } },
      relations: ['cartDetails', 'cartDetails.product'],
    });

    if (!cart) throw new Error('Cart not found');

    const detail = cart.cartDetails.find(
      (d) => d.product.product_id === updateCartDto.product.product_id,
    );

    if (detail) {
      detail.quantity = updateCartDto.quantity;
      detail.price = detail.quantity * detail.product.price;
      await this.cartDetailRepository.save(detail);
    }

    cart.subtotal = cart.cartDetails.reduce((s, d) => s + d.price, 0);
    cart.total = cart.subtotal;

    return this.cartRepository.save(cart);
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
    return this.cartRepository.findOne({
      where: { user: { user_id } },
      relations: {
        cartDetails: {
          product: { images: true },
        },
        user: true,
      },
    });
  }

  async removeDetail(cart_detail_id: number) {
    const cartDetail = await this.cartDetailRepository.findOne({
      where: { cart_detail_id },
      relations: ['cart', 'cart.cartDetails'],
    });

    if (!cartDetail) throw new Error('Cart detail not found');

    const cart = cartDetail.cart;

    cart.cartDetails = cart.cartDetails.filter(
      (d) => d.cart_detail_id !== cart_detail_id,
    );

    cart.subtotal = cart.cartDetails.reduce((s, d) => s + d.price, 0);
    cart.total = cart.subtotal;

    await this.cartDetailRepository.remove(cartDetail);

    return this.cartRepository.save(cart);
  }

  async clearCartByUser(user_id: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { user_id } },
      relations: ['cartDetails'],
    });

    if (!cart) throw new Error('Cart not found');

    if (cart.cartDetails.length > 0) {
      await this.cartDetailRepository.remove(cart.cartDetails);
    }

    cart.cartDetails = [];
    cart.subtotal = 0;
    cart.total = 0;

    return this.cartRepository.save(cart);
  }
}