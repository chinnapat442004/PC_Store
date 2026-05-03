import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartDetail } from './entities/cart_detail';
import { Coupon } from 'src/coupon/entities/coupon.entity';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail)
    private cartDetailRepository: Repository<CartDetail>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(user_id: number, createCartDto: CreateCartDto) {
    let cart = await this.cartRepository.findOne({
      where: { user: { user_id: user_id } },
      relations: ['cartDetails', 'cartDetails.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: await this.userRepository.findOne({
          where: { user_id },
        }),
        subtotal: 0,
        total: 0,
        cartDetails: [],
      });
      cart = await this.cartRepository.save(cart);
    }

    const product = await this.productRepository.findOne({
      where: { product_id: createCartDto.productId },
    });

    if (!product) throw new BadRequestException('Product not found');

    const cartDetail = this.cartDetailRepository.create({
      product: product,
      quantity: createCartDto.quantity,
      price: product.price * createCartDto.quantity,
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

    const product = await this.productRepository.findOne({
      where: { product_id: updateCartDto.productId },
    });

    if (!product) throw new BadRequestException('Product not found');

    const existingDetail = cart.cartDetails.find(
      (d) => d.product.product_id === product.product_id,
    );

    if (existingDetail) {
      existingDetail.quantity += updateCartDto.quantity;
      existingDetail.price =
        existingDetail.quantity * existingDetail.product.price;

      await this.cartDetailRepository.save(existingDetail);
    } else {
      const newDetail = this.cartDetailRepository.create({
        cart,
        product: product,
        quantity: updateCartDto.quantity,
        price: updateCartDto.quantity * product.price,
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
      (d) => d.product.product_id === updateCartDto.productId,
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
        coupon: true,
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
    cart.coupon = null;
    cart.discount_amount = 0;
    return this.cartRepository.save(cart);
  }

  private calculateDiscount(subtotal: number, coupon: Coupon): number {
    if (subtotal < coupon.min_order) {
      throw new Error('ยอดสั่งซื้อไม่ถึงขั้นต่ำ');
    }

    let discount = 0;

    if (coupon.discount_type === 'percent') {
      discount = subtotal * (coupon.discount_value / 100);

      if (coupon.max_discount) {
        discount = Math.min(discount, coupon.max_discount);
      }
    } else {
      discount = coupon.discount_value;
    }

    discount = Math.min(discount, subtotal);

    return Number(discount.toFixed(2));
  }

  async applyCoupon(user_id: number, code: string) {
    const cart = await this.cartRepository.findOne({
      where: { user: { user_id } },
    });

    if (!cart) throw new BadRequestException('ไม่สามารถใช้โค้ดนี้ได้');

    const coupon = await this.couponRepository.findOne({
      where: { code },
    });

    if (!coupon) throw new BadRequestException('ไม่สามารถใช้โค้ดนี้ได้');

    const now = new Date();

    if (now < coupon.start_date || now > coupon.end_date) {
      throw new BadRequestException('ไม่สามารถใช้โค้ดนี้ได้');
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      throw new BadRequestException('โค้ดส่วนลดถูกใช้งานครบแล้ว');
    }

    if (coupon.min_order && cart.subtotal < coupon.min_order) {
      throw new BadRequestException('ยอดสั่งซื้อไม่ถึงขั้นต่ำ');
    }

    const discount = this.calculateDiscount(cart.subtotal, coupon);

    cart.discount_amount = discount;
    cart.total = cart.subtotal - discount;
    cart.coupon = coupon;

    return this.cartRepository.save(cart);
  }

  async removeCoupon(user_id: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { user_id } },
    });

    if (!cart) throw new Error('Cart not found');

    cart.discount_amount = 0;
    cart.total = cart.subtotal;

    cart.coupon = null;

    return this.cartRepository.save(cart);
  }
}
