import { PaymentMethod } from '../emums/order-status.enum';

export class CreateOrderDto {
  payment_method: PaymentMethod;
  coupon_code?: string;

  items?: {
    product_id: number;
    quantity: number;
  }[];

  is_buy_now: boolean;
}
