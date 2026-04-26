import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderStatus, PaymentMethod } from "../emums/order-status.enum";
import { OrderDetail } from "./order-detail";
import { User } from "src/users/entities/user.entity";
import { Branch } from "src/branches/entities/branch.entity";
import { OrderStatusHistory } from "./order-status-history.entity";
import { Shipment } from "src/shipment/entities/shipment.entity";



@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at: Date;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  payment_method: PaymentMethod;


  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  subtotal: number;




  @Column('numeric', { precision: 10, scale: 2 })
  total_amount: number;


  @Column({ nullable: true })
  coupon_code: string;

  @Column({ type: 'varchar', nullable: true })
  discount_type: 'percent' | 'fixed';

  @Column('numeric', { precision: 10, scale: 2, nullable: true })
  discount_value: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  discount_amount: number;


  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;


  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address_detail: string;

  @Column({ nullable: true })
  sub_district: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  zipcode: string;

  @ManyToOne(() => Shipment, (shipment) => shipment.orders, { nullable: true })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @Column({ nullable: true })
  tracking_number: string;

  @OneToMany(() => OrderDetail, (d) => d.order)
  details: OrderDetail[];

  @ManyToOne(() => Branch, (branch) => branch.orders)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @OneToMany(() => OrderStatusHistory, (status) => status.order)
  orderHistory: OrderStatusHistory[];
}