import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BranchStatus } from '../enums/branch-status';
import { Stock } from 'src/stock/entities/stock.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  branch_id: number;

  @Column()
  branch_name: string;

  @Column()
  address: string;

  @Column({
    type: 'text',
  })
  status: BranchStatus;

  @Column({ type: 'real' })
  lat: number;

  @Column({ type: 'real' })
  lng: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, (user) => user.branch)
  users: User[];

  @OneToMany(() => Stock, (stock) => stock.branch)
stocks: Stock[];
}
