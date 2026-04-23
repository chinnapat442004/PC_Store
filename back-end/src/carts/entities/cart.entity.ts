import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartDetail } from './cart_detail';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  cart_id: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.cart)
  cartDetails: CartDetail[];

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
