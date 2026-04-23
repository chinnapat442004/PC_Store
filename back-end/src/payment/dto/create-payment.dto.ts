import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    order_id: number;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNumber()
    @IsOptional()
    store_account_id?: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsOptional()
    slip_image?: string;

    @IsString()
    @IsOptional()
    transaction_reference?: string;

    @IsDateString()
    @IsOptional()
    payment_date?: Date;
}