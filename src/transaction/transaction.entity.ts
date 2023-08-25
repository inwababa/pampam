import { User } from "src/users/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity({name:'transactions'})
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
    amount: number;

    @Column()
    type: string;

    @Column()
    status: string;

    @Column()
    reference: string;

    @Column()
    narration: string;

  @ManyToOne(() => User, user => user.transactions, {
    onDelete: 'CASCADE',
    eager: true,
})
@JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}