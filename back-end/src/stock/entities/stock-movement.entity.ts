import { Branch } from 'src/branches/entities/branch.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('stock_movement')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  branch_id: number;

  @Column()
  change_qty: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  ref_id: number;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch
}