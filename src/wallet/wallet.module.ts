import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from '../wallet/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionEntity } from 'src/transaction/transaction.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Wallet, TransactionEntity]), UsersModule, TransactionModule],
  controllers: [WalletController],
  providers: [WalletService, Wallet, TransactionService],
  exports: [WalletService, Wallet],
})
export class WalletModule {}
