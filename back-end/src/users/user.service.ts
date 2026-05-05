import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { Branch } from 'src/branches/entities/branch.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) { }

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

    user.name = createUserDto.name;
    user.password = createUserDto.password;
    user.branch = await this.branchRepository.findOne({
      where: { branch_id: createUserDto.branch_id },
    });

    if (creatorRole === Role.ADMIN) {
      user.role = Role.MANAGER;
    } else if (creatorRole === Role.MANAGER) {
      user.role = Role.STAFF;
    } else {

      throw new ConflictException('You are not allowed to create users');
    }

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async registerCustomer(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      this.logger.error(
        `User creation failed: email "${createUserDto.email}" is already in use.`,
      );
      throw new ConflictException('Email is already taken');
    }

    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.name = createUserDto.name;

    user.role = Role.CUSTOMER;
    user.enabled = true;

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: { branch: true },
    });
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findOne(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id },
      relations: { branch: true },
    });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['branch'],
    });
  }

  private async ensureCanManage(currentUser: any, targetUser: User) {
    if (currentUser.role === Role.ADMIN) {
      if (targetUser.role !== Role.MANAGER) {
        throw new ForbiddenException('Admin can only manage manager accounts');
      }
      return;
    }

    if (currentUser.role === Role.MANAGER) {
      if (targetUser.role !== Role.STAFF) {
        throw new ForbiddenException('Manager can only manage staff accounts');
      }
      if (targetUser.branch?.branch_id !== currentUser.branch_id) {
        throw new ForbiddenException(
          'Manager can only update staff in their own branch',
        );
      }
      return;
    }

    throw new ForbiddenException('You are not allowed to update this user');
  }

  async updateUser(
    user_id: number,
    currentUser: any,
    updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { user_id },
      relations: { branch: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.ensureCanManage(currentUser, user);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new ConflictException('Email is already taken');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.enabled !== undefined) {
      user.enabled = updateUserDto.enabled;
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async updateProfile(user_id: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.name) {
      user.name = updateProfileDto.name;
    }

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async changePassword(user_id: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { user_id } });

    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้งาน');
    }

    if (user.password !== updatePasswordDto.current_password) {
      throw new UnauthorizedException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }

    if (updatePasswordDto.new_password !== updatePasswordDto.confirm_password) {
      throw new BadRequestException('รหัสผ่านใหม่ไม่ตรงกัน');
    }

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async resetPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (forgotPasswordDto.new_password !== forgotPasswordDto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    user.password = forgotPasswordDto.new_password;
    await this.userRepository.save(user);

    return {
      message: 'Password has been reset successfully',
    };
  }

  async findUsersByRole(
    role: Role,
    page: number,
    limit: number,
    search?: string,
    branch_id?: number,
  ) {
    const skip = (page - 1) * limit;

    let where: any = { role };

    if (branch_id) {
      where.branch = { branch_id };
    }

    if (search) {
      where = [
        { role, name: Like(`%${search}%`) },
        { role, email: Like(`%${search}%`) },
      ];
    }

    const [data, total] = await this.userRepository.findAndCount({
      where,
      relations: {
        branch: true,
      },
      skip,
      take: limit,
      order: {
        user_id: 'DESC',
      },
    });

    return {
      data: data.map((user) => {
        delete user.password;
        return user;
      }),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getNewCustomersMonth() {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'CUSTOMER' })
      .andWhere('user.createdAt BETWEEN :start AND :end', {
        start,
        end,
      })
      .getCount();
  }

  async getUserStats() {
    const total = await this.userRepository.count();

    const staff = await this.userRepository.count({
      where: { role: Role.STAFF },
    });

    const manager = await this.userRepository.count({
      where: { role: Role.MANAGER },
    });

    const customer = await this.userRepository.count({
      where: { role: Role.CUSTOMER },
    });

    return {
      total,
      manager,
      staff,
      customer,
    };
  }

  async countStaffInMyBranch(branchId: number) {
    return this.userRepository.count({
      where: {
        role: Role.STAFF,
        branch: {
          branch_id: branchId,
        },
      },
    });
  }
}
