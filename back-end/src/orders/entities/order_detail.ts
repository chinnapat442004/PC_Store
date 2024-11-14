import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  order_detail_id: number;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
