import { CartDetail } from 'src/carts/entities/cart_detail';
import { Category } from 'src/categories/entities/category.entity';
import { OrderDetail } from 'src/orders/entities/order_detail';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Image } from './image.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @Column()
  sold: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetail: OrderDetail[];

  @ManyToOne(() => Category, (categery) => categery.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => CartDetail, (cartDetails) => cartDetails.product)
  cartDetails: CartDetail[];

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];
}
