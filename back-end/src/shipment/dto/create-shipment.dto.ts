import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateShipmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}