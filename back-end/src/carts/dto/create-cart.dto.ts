import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateCartDto {
  user: User;
  quantity: number;
  product: Product;
}
