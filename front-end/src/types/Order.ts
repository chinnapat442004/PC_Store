import type { DiscountType } from "./Coupon";
import type { OrderDetail } from "./OrderDetail";
import type { PaymentMethod } from "./Payment";
import type { Shipment } from "./Shipment";


export type OrderStatus =
    | 'pending'
    | 'waiting_verify'
    | 'confirmed'
    | 'picking'
    | 'shipped'
    | 'done'
    | 'cancelled'

type CreateOrder = {
    payment_method: PaymentMethod;
    coupon_code?: string
}



type UpdateOrder = {
    status: OrderStatus
}

type UpdateTracking = {
    tracking_number: string;
    shipment_id: number;
}


type Order = {
    order_id: number
    created_at: string
    updated_at: string
    stripe_payment_id: string | null
    subtotal: number
    coupon_code?: string
    discount_type?: DiscountType
    discount_value?: number
    discount_amount?: number
    total_amount: number
    order_status: OrderStatus
    payment_method: PaymentMethod
    fullname: string
    phone: string
    address_detail: string
    sub_district: string
    district: string
    province: string
    zipcode: string
    tracking_number: string
    shipment: Shipment
    details: OrderDetail[]
    orderHistory: OrderStatusHistory[]

}



export type OrderStatusHistory = {
    id: number;
    order_id: number;
    user_id: number;
    status: OrderStatus;
    created_at: Date
};

export { type CreateOrder, type Order, type UpdateOrder, type UpdateTracking }