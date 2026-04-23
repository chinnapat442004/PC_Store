import { Cart } from 'src/carts/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { Branch } from 'src/branches/entities/branch.entity';
import { Address } from 'src/address/entities/address.entity';
import { OrderStatus } from 'src/orders/emums/order-status.enum';
import { OrderStatusHistory } from 'src/orders/entities/order-status-history.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'text',
  })
  role: Role;
  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (carts) => carts.user)
  carts: Cart[];

  @OneToMany(() => Address, (addresses) => addresses.user)
  addresses: Address[];

  @ManyToOne(() => Branch, (branch) => branch.users)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @OneToMany(() => OrderStatusHistory, (status) => status.user)
  orderStatus: OrderStatus[];




}
