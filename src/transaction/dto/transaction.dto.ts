import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';


export class TransactionDto {
    
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsString()
    reference: string;

    @IsNotEmpty()
    @IsString()
    narration: string;
}