import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private  usersService: UsersService) {}

  @ApiOperation({
    summary: 'Register User', 
    description:'Registration endpoint'
    })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiOperation({
    summary: 'Reset Password', 
    description:'Reset Password endpoint'
    })
  @Put(':id/update-password')
  async resetPassword(@Param('id') id: number, @Body() resetPasswordDto: ResetPasswordDto) {
    await this.usersService.resetPassword(resetPasswordDto, id);
    return { message: 'Password updated successfully' };
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.usersService.showById(+id);
  }
}