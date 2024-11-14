import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateOrderDto {
  order_status: string;
  stripe_payment_id: string;
  status: string;
  currency: string;
  orderDetail: {
    quantity: number;
    price: number;
    product: Product;
  }[];
  user: User;
}
