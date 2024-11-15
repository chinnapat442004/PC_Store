import { Category } from 'src/categories/entities/category.entity';

// create-product.dto.ts
export class CreateProductDto {
  title: string;
  description: string;
  price: number;
  sold: number;
  quantity: number;
  images: string[];
  category: Category;
}
