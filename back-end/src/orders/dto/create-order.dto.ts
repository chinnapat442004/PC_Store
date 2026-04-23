import { PaymentMethod } from "../emums/order-status.enum";


export class CreateOrderDto {
  payment_method: PaymentMethod;
  details: {
    product_id: number;
    quantity: number;
  }[];
}