import type { Order } from "./Order";

export type PaymentMethod = 'cod' | 'promptpay';

export type CreatePaymentType = {
    order_id: number;
    user_id: number;
    store_account_id?: number;
    amount: number;
    slip_image?: string;
    transaction_reference?: string;
    payment_date?: Date;
};


export type PaymentAccount = {
    payment_id?: number,
    amount: number,
    qr_image: string,
    promptpay_number: string,
    account_name: string,
}

export type PaymentTransaction = {
    payment_id: number
    order_id: number
    amount: string
    slip_image: string | null
    created_at: string
    updated_at: string
    order: Order
}