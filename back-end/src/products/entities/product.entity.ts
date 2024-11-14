import { OrderDetail } from 'src/orders/entities/order_detail';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

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

  @OneToMany(() => OrderDetail, (OrderDetail) => OrderDetail.product)
  orderDetail: OrderDetail[];
}
