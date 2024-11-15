import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity'; // เชื่อมโยงกับ Cart
import { Product } from 'src/products/entities/product.entity'; // เชื่อมโยงกับ Product

@Entity()
export class CartDetail {
  @PrimaryGeneratedColumn()
  cart_detail_id: number;

  @Column('int')
  quantity: number;

  @Column('float')
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Cart, (cart) => cart.cartDetails)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
