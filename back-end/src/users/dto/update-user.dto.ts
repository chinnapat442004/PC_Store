import {
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsString,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  enabled?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}
