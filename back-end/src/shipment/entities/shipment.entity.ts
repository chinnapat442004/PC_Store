import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

@Entity('shipment')
export class Shipment {
  @PrimaryGeneratedColumn()
  shipment_id: number;

  @Column()
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Order, (order) => order.shipment)
  orders: Order[];
}
