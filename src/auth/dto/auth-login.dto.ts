import { IsEmail, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class AuthLoginDto {
    @ApiProperty()
    @IsNotEmpty() @IsEmail() 
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}