import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class FundWalletByCardDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cardExpiration: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    card: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cardCvv: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pin: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    otp: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: string;
}