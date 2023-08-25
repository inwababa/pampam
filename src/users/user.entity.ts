import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import * as bcrypt from 'bcryptjs';
import { Wallet } from 'src/wallet/wallet.entity';
import { TransactionEntity } from 'src/transaction/transaction.entity';
import { Exclude, Expose } from 'class-transformer';

  
  @Entity({name: 'users'})
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;

    @Column()
    name: string;
  
    @Column()
    password: string;

    @Column()
    transactionPin: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 8);
    }
  
    async validatePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    }

    @OneToOne(() => Wallet, wallet => wallet.user, { cascade: true })
  @JoinColumn()
  wallet: Wallet; // Define the wallet property

  @OneToMany(() => TransactionEntity, transaction => transaction.user) // Add this line
  transactions: TransactionEntity[]; // Define the transactions property
  }