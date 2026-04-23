import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('store_payment_config')
export class StorePaymentConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    promptpay_number: string;

    @Column({ type: 'varchar', nullable: true })
    account_name: string;

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}