import { IsOptional, IsEmail, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  enabled?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}
