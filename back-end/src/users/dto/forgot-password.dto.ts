import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  confirm_password: string;
}
