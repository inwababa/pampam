import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class WithdrawWalletDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    account_bank: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    transactionPin: string;
}