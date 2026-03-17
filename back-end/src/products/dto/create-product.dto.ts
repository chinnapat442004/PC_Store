import { Category } from 'src/categories/entities/category.entity';

// create-product.dto.ts
export class CreateProductDto {
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  categoryId: number;
}