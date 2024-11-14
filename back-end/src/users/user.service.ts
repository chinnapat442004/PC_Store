import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.address = createUserDto.address;
    user.email = createUserDto.email;
    user.enabled = createUserDto.enabled;
    user.image = createUserDto.image;
    user.name = createUserDto.name;
    user.password = createUserDto.password;
    user.role = createUserDto.role;

    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(user_id: number) {
    return await this.userRepository.findOne({ where: { user_id } });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    user.address = updateUserDto.address;
    user.email = updateUserDto.email;
    user.enabled = updateUserDto.enabled;
    user.image = updateUserDto.image;
    user.name = updateUserDto.name;
    user.password = updateUserDto.password;
    user.role = updateUserDto.role;
    return await this.userRepository.save(user);
  }

  async remove(user_id: number) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    return await this.userRepository.remove(user);
  }
}
