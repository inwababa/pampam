import { User } from 'src/users/user.entity';
import { Exclude, Expose } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';


@Entity({name: 'wallets'})
export class Wallet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    balance: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => User, user => user.wallet, {
        onDelete: 'CASCADE',
        eager: true,
    }) // Define the relationship with UserEntity
  @JoinColumn()
  
  user: User; // Define the user property

//   @Expose() // Expose specific properties for serialization
//   get userId(): number {
//     return this.user.id;
//   }
}