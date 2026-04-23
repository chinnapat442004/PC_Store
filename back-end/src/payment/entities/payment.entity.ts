import { Order } from 'src/orders/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column({ type: 'int', unique: true })
    order_id: number;

    @Column({ type: 'numeric' })
    amount: number;

    @Column({ type: 'varchar', nullable: true })
    slip_image: string;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;


    @OneToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}