import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  order_detail_id: number;


  @Column()
  product_image: string;

  @Column()
  quantity: number;

  @Column('numeric')
  price: number;

  @Column()
  order_id: number;

  @Column()
  product_id: number;

  @Column()
  product_title: string;

  @ManyToOne(() => Order, (o) => o.details)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}