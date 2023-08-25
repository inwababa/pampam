import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionEntity } from 'src/transaction/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, TransactionEntity])],
  controllers: [UsersController],
  providers: [UsersService, User, WalletService, TransactionService],
  exports: [UsersService]
})
export class UsersModule {}
