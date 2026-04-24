import { IsEmail, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;
  password: string;
  name: string;
  image: string;
  @IsEnum(Role)
  role: Role;
  @ValidateIf((o) => o.role === Role.MANAGER || o.role === Role.STAFF)
  @IsNotEmpty({ message: 'branch is required for owner or employee' })
  branch_id: number;


}
