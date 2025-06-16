import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  password: string;
  name: string;
  image: string;
  role: string;
  enabled: boolean;
  address: string;
}
