import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    IsDateString,
    IsInt,
    IsBoolean,
} from 'class-validator';
import { DiscountType } from '../entities/coupon.entity';

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(DiscountType)
    discount_type: DiscountType;

    @IsNumber()
    @Min(0)
    discount_value: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    min_order?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    max_discount?: number;

    @IsDateString()
    start_date: Date;

    @IsDateString()
    end_date: Date;

    @IsInt()
    @IsOptional()
    @Min(1)
    usage_limit?: number;

    @IsInt()
    @IsOptional()
    @Min(0)
    used_count?: number;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}