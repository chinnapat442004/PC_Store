import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { OrderStatus } from "../emums/order-status.enum";
import { User } from "src/users/entities/user.entity";

@Entity('order_status_history')
export class OrderStatusHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @Column()
    user_id: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;


    @Column({ default: () => 'now()' })
    created_at: Date;

    @ManyToOne(() => Order, (o) => o.orderHistory)
    @JoinColumn({ name: 'order_id' })
    order: Order;



    @ManyToOne(() => User, (user) => user.orderStatus)
    @JoinColumn({ name: 'user_id' })
    user: User;
}