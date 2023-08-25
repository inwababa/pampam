import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWalletDto {

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    balance: number;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    userId: number;

}


export class WalletResponseDto {
    id: number;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
  }