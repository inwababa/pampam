import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ResetPasswordDto {
    @IsNotEmpty()
    @ApiProperty() new_password: string;

    @IsNotEmpty()
    @ApiProperty() old_password: string;
}