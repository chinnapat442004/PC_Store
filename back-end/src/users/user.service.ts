import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    creatorRole: Role,
  ): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      this.logger.error(
        `User creation failed: email "${createUserDto.email}" is already in use.`,
      );
      throw new ConflictException('Email is already taken');
    }

    const user = new User();
    user.email = createUserDto.email;
    user.enabled = true;
    user.image = createUserDto.image;
    user.name = createUserDto.name;
    user.password = createUserDto.password;

    if (creatorRole === Role.ADMIN) {
      user.role = Role.MANAGER;
    } else if (creatorRole === Role.MANAGER) {
      user.role = Role.STAFF;
    } else {
      throw new ConflictException('You are not allowed to create users');
    }

    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(user_id: number) {
    return await this.userRepository.findOne({ where: { user_id } });
  }

 async findOneByEmail(email: string) {
  return this.userRepository.findOne({
    where: { email },
    relations: ['branch'], 
  });
}

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    user.email = updateUserDto.email;
    user.enabled = updateUserDto.enabled;
    user.image = updateUserDto.image;
    user.name = updateUserDto.name;
    user.password = updateUserDto.password;
    user.role = updateUserDto.role;
    return await this.userRepository.save(user);
  }

  // async remove(user_id: number) {
  //   const user = await this.userRepository.findOne({ where: { user_id } });
  //   return await this.userRepository.remove(user);
  // }

  async findUsersByRole(
    role: Role,
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    let where: any = { role };

    if (search) {
      where = [
        { role, name: Like(`%${search}%`) },
        { role, email: Like(`%${search}%`) },
      ];
    }

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        user_id: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
