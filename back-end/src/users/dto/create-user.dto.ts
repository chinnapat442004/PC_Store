import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  password: string;
  name: string;
  image: string;
  @IsEnum(Role)
  role: Role;
  enabled: boolean;
  address: string;
}
