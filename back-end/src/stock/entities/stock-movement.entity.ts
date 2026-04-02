import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}