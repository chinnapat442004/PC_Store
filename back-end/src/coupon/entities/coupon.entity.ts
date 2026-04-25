import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DiscountType {
    PERCENT = 'percent',
    FIXED = 'fixed',
}


export enum CouponStatus {
    ACTIVE = 'active',        // ใช้งานได้
    SCHEDULED = 'scheduled',  // ตั้งเวลา
    EXPIRED = 'expired',      // หมดอายุ
    DISABLED = 'disabled',    // ปิดใช้งาน
    USED_UP = 'used_up',      // ใช้ครบแล้ว
}

@Entity('coupon')
export class Coupon {
    @PrimaryGeneratedColumn()
    coupon_id: number;

    @Column({ unique: true })
    code: string;
    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: DiscountType,
        enumName: 'coupon_discount_type_enum',
    })
    discount_type: DiscountType;

    @Column({ type: 'float' })
    discount_value: number;

    @Column({ type: 'double precision', nullable: true })
    min_order: number;

    @Column({ type: 'float', nullable: true })
    max_discount: number;

    @Column({ type: 'timestamp' })
    start_date: Date;

    @Column({ type: 'timestamp' })
    end_date: Date;


    @Column({ type: 'int', nullable: true, })
    usage_limit: number;


    @Column({ type: 'int', default: 0, })
    used_count: number;


    @Column({ default: true, })
    is_active: boolean;
}