import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';

@Entity('brand')
export class Brand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  logo: string;

@OneToMany(() => Product, (products) => products.brand)
products: Product[];
 
}