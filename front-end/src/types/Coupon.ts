export enum DiscountType {
    PERCENT = 'percent',
    FIXED = 'fixed',
}

export enum CouponStatus {
    ACTIVE = 'active',
    SCHEDULED = 'scheduled',
    EXPIRED = 'expired',
    DISABLED = 'disabled',
    USED_UP = 'used_up',
}

export interface Coupon {
    coupon_id: number;
    code: string;
    description: string
    discount_type: DiscountType;
    discount_value: number;
    min_order?: number;
    max_discount?: number;
    start_date: Date;
    end_date: Date;
    usage_limit?: number;
    used_count: number;
    is_active: boolean;
    status?: CouponStatus;
}



export interface CouponPayload {
    coupon_id?: number;
    code: string;
    description?: string;
    discount_type: DiscountType;
    discount_value: number;
    min_order?: number;
    max_discount?: number;
    start_date: Date;
    end_date: Date;
    usage_limit?: number;
    used_count?: number;
    is_active?: boolean;
}