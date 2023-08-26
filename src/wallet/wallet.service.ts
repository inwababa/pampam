import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from '../users/user.entity';
import { Wallet } from './wallet.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto, WalletResponseDto } from './dto/create-wallet-dto';
import { FundWalletByCardDto } from './dto/fund-wallet-card.dto';
import { WithdrawWalletDto } from './dto/withraw-wallet.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionDto } from 'src/transaction/dto/transaction.dto';
import { Console } from 'console';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
        private readonly  usersService: UsersService,
        private readonly transactionService: TransactionService,
    ) {}

    

    async createWalletForUser(userId: number): Promise<WalletResponseDto> {
        const user = await this.usersService.findUserById(userId);
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        // Check if user already has a wallet
        if (user.wallet) {
          throw new HttpException('User already has a wallet', HttpStatus.CONFLICT);
        }
    
        // Create a new wallet and associate it with the user
  const newWallet = this.walletRepository.create();
  user.wallet = newWallet; // Associate the wallet with the user
  newWallet.user = user; // Associate the user with the wallet

  await this.usersService.updateUser(user); // Update the user's wallet property
  await this.walletRepository.save(newWallet); // Save the wallet with the associated user

  return {
    id: newWallet.id,
    balance: newWallet.balance,
    createdAt: newWallet.createdAt,
    updatedAt: newWallet.updatedAt,
  };
    
      }


      async fundWalletByCard(userId: number, type: string, fundWalletByCardDto: FundWalletByCardDto): Promise<Wallet> {

        try {

          //Assuming we have a third merchant Api to process the debit card we run the process first and await for the response before proceeding to fun the user wallet

            const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        let wallets = await this.walletRepository.findOne({
            where: { user: { id: user.id } },
          });

          //Assuming we have a third merchant Api to process the debit card we run the process first and await for the response before proceeding to fun the user wallet


        if (!wallets) {

          // Create a new wallet and associate it with the user
        wallets = this.walletRepository.create({
          user: user,
          balance: fundWalletByCardDto.amount, // Set initial balance
        });

        await this.walletRepository.save(wallets);

        // Associate the wallet with the user
      user.wallet = wallets;
      await this.usersService.updateUser(user);


      // Create and save a transaction record using the TransactionService and FundWalletByCardDto
      const transactionDto: TransactionDto = {
        amount: fundWalletByCardDto.amount,
        type: type,
        status: fundWalletByCardDto.status,
        reference: `funded-${userId}`,
        narration: 'transaction processing'
      };
      await this.transactionService.createTransaction(user, transactionDto);

      
            return wallets
          }
    
        // Update user's wallet balance
    //const wallet = user.wallet;
     wallets.balance += fundWalletByCardDto.amount;

    await this.walletRepository.save(wallets);

    // Create and save a transaction record using the TransactionService and FundWalletByCardDto
    const transactionDto: TransactionDto = {
      amount: fundWalletByCardDto.amount,
      type: type,
      status: fundWalletByCardDto.status,
      reference: `funded-${userId}`,
      narration: 'transaction processing'
    };
    await this.transactionService.createTransaction(user, transactionDto);

    return wallets;
            
        } catch (error) {
            console.log(error)
        }
        
      }

      async fetchWalletBalance(userId: number): Promise<{ balance: number }> {
        const wallet = await this.walletRepository.findOne({
          where: { user: { id: userId } },
        });
    
        if (!wallet) {
          throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
        }
    
        return { balance: wallet.balance };
      }


      async transferCash( userId: number, withdrawWalletDto: WithdrawWalletDto ){

            const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const wallets = await this.walletRepository.findOneOrFail({
            where: { user: { id: user.id } },
          });

          if (!wallets) {
            throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
          }

          if (wallets.balance < withdrawWalletDto.amount) {
            throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
          }
          
          //console.log(withdrawWalletDto.transactionPin)

          if(user.transactionPin !== withdrawWalletDto.transactionPin ){
            throw new HttpException('Incorrect Transaction Pin', HttpStatus.UNAUTHORIZED);
          }
          //console.log(wallets)

          // Create and save a transaction record using the TransactionService and FundWalletByCardDto
        const transactionDto: TransactionDto = {
            amount: withdrawWalletDto.amount,
            type: 'withdrawal',
            status: 'successful',
            reference: `transfer-${userId}`,
            narration: `You withdraw ${withdrawWalletDto.amount} from your wallet`
          };
          await this.transactionService.createTransaction(user, transactionDto);

          // Update user's wallet balance
    const wallet = user.wallet;
    wallets.balance -= withdrawWalletDto.amount;

   await this.walletRepository.save(wallets);

   return {
    status: 'successful',
    message: `You withdraw ${withdrawWalletDto.amount} from your wallet`,
    walletBalance: wallets.balance
}

        
      }



async fundWalletByBank(user: any, data: FundWalletByCardDto): Promise<Wallet> {

    const wallet = await this.checkIfWalletExists({
        where: { user: { id: user.userId } },
    });

    if (!wallet) throw new HttpException('wallet not found', HttpStatus.NOT_FOUND);
    
    
    if (data.status === 'success') {
        await this.updateWalletBalance(Number(data.amount), wallet );
}

throw new HttpException('Error Occurred', HttpStatus.BAD_REQUEST)

}



    async checkIfWalletExists( obj: Record<any, unknown>): Promise<any | Wallet> {

        const findWallet = await this.walletRepository.findOne(obj);
            if (!findWallet) throw new HttpException('Wallet not Found', HttpStatus.NOT_FOUND);
            return findWallet;
        
    }


    // async reconcileFundMethod(user: any, query: string, data: any) {
    //     try {
    //         if (!query)
    //             throw new HttpException(
    //                 'method of funding is required', HttpStatus.BAD_REQUEST
    //             );
    //         return query == 'card'
    //             ? await this.fundWalletWithCard(user, data)
    //             : await this.fundWalletByBank(user, data);
    //     } catch (error) {
    //         throw new HttpException('Error Occured', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }


    public checkSufficientFunds( amount: number, wallet: Partial<Wallet>, ): boolean {
        if (wallet.balance - amount < 100) {
            return false;
        }
        return true;
    }

    public async updateWalletBalance( amount: number, wallet: Partial<Wallet>, ): Promise<Partial<Wallet>> {
        wallet.balance += amount;
        await wallet.save();
        return wallet;
    }

}
