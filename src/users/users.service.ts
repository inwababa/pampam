import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
    validateUser(authLoginDto: AuthLoginDto) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}

      async create(createUserDto: CreateUserDto): Promise<User> {
        // check if the user exists in the db    
    const userInDb = await this.userRepository.findOne({ 
        where: { email: createUserDto.email } 
    });
    if (userInDb) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);    
    }

        const user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);

        delete user.password;
        return user;
      }

      async  resetPassword(resetPasswordDto: ResetPasswordDto, id: number ): Promise<User> {
        // check if the user exists in the db    
    const userInDb = await this.userRepository.findOne({ 
        where: { id: id } 
    });
    if (!userInDb) {
        throw new HttpException('Credentials not found', HttpStatus.BAD_REQUEST);    
    }

    if (!(await userInDb?.validatePassword(resetPasswordDto.old_password))) {
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST)
      }

      const user = await this.userRepository.update( id, {password:  await bcrypt.hash(resetPasswordDto.new_password, 8)} );

        return ;
        
      }


  async showById(id: number): Promise<User> {
    const user = await this.findById(id);

    delete user.password;
    return user;
  }


  async findUserById(userId: number): Promise<User> {
    
        const singleUser = await this.userRepository.findOne({ where: { id: userId } });
        if (!singleUser) throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
        return singleUser;
    
}


async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findById(id: number) {
    return await User.findOneBy({id:id});
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }
}