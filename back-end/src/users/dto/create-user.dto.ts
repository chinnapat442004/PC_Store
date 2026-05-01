import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  confirm_password: string;

  @ValidateIf((o) => o.role === Role.MANAGER || o.role === Role.STAFF)
  @IsNotEmpty()
  branch_id: number;
}