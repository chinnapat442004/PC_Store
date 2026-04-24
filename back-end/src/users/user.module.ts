import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Branch])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule { }
