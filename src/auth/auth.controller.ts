import { Controller, Body, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('users Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @ApiOperation({
    summary: 'User Login', 
    description:'users login endpoint'
    })
  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async test() {
    return 'Success!';
  }
}
