import { IsEnum } from 'class-validator';
import { BranchStatus } from '../enums/branch-status';

export class CreateBranchDto {
  branch_name: string;
  address: string;
  lat: number;
  lng: number;
  @IsEnum(BranchStatus)
  status: BranchStatus;
}
