import { IsOptional, IsString } from 'class-validator';

export class UpdateStorePaymentConfigDto {
    @IsOptional()
    @IsString({ message: 'เบอร์ PromptPay ต้องเป็นข้อความ' })
    promptpay_number?: string;

    @IsOptional()
    @IsString({ message: 'ชื่อบัญชีต้องเป็นข้อความ' })
    account_name?: string;
}