import { Branch } from 'src/branches/entities/branch.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn({ name: 'stock_id' })
  id: number;

  @Column()
  product_id: number;

  @Column()
  branch_id: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}