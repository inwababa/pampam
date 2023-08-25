import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UserDecorator } from 'src/users/decorators/user.decorator';
import { FundWalletByCardDto } from './dto/fund-wallet-card.dto';
import { FundWalletByBanktDto } from './dto/fund-wallet-bank.dto';
import { CreateWalletDto } from './dto/create-wallet-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WithdrawWalletDto } from './dto/withraw-wallet.dto';
import { Wallet } from './wallet.entity';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';


@ApiTags('wallet Transactions')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create Wallet', 
    description:'users needs to create wallet'
    })
    @ApiSecurity('Bearer Token')
  @Post(':userId/create')
  async createWallet(@Param('userId') userId: number) {
    return await this.walletService.createWalletForUser(userId);
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Fund Wallet', 
    description:'wallet funding endpoint'
    })
    @ApiSecurity('Bearer Token')
  @Post(':userId/fund')
  async fundWalletByCard(
    @Param('userId') userId: number,
    @Query('type') type: string,
    @Body() fundWalletByCardDto: FundWalletByCardDto, // Use the FundWalletByCardDto
  ) {
    return this.walletService.fundWalletByCard(userId, type, fundWalletByCardDto);
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Transfer Fund', 
    description:'Transfer Fund from Wallet endpoint'
    })
    @ApiSecurity('Bearer Token')
  @Post(':userId/transfer')
  async transferCash(
    @Param('userId') userId: number,
    @Body() withdrawWalletDto:WithdrawWalletDto,
  ) {
   
   return await this.walletService.transferCash(userId, withdrawWalletDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'wallet balance', 
    description:'Check Wallet balance endpoint'
    })
    @ApiSecurity('Bearer Token')
  @Get(':userId/balance')
  async getWalletBalance(@Param('userId') userId: number) {
    const balance = await this.walletService.fetchWalletBalance(userId);
    return balance;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
    async getWallet(@UserDecorator() user: any) {
        return await this.walletService.checkIfWalletExists({
            where: { user: { id: user.userId } },
        });
    }


    // @Post('create-wallet')
    // async createWallet(@Body() createWalletDto:CreateWalletDto) {
    //     await this.walletService.createWallet(createWalletDto)
    //     return { message: 'Wallet created successfully' };
    // }


}
