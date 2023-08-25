import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
      ) {}
    
      async createTransaction(user: User, transactionDto:TransactionDto): Promise<TransactionEntity> {
        const transaction = this.transactionRepository.create({
            ...transactionDto,  
          user,
        });
        return this.transactionRepository.save(transaction);
      }
}
