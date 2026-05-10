import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  ForbiddenException,
  UseGuards,
  Query,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Role } from './enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const currentUser = req.user;

    if (currentUser.role === Role.ADMIN) {
      return this.userService.findUsersByRole(
        Role.MANAGER,
        +page,
        +limit,
        search,
      );
    }
    if (currentUser.role === Role.MANAGER) {
      return this.userService.findUsersByRole(
        Role.STAFF,
        +page,
        +limit,
        search,
        currentUser.branch_id,
      );
    }

    throw new ForbiddenException('พนักงานไม่มีสิทธิ์เข้าถึงข้อมูลผู้ใช้งาน');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Post()
  async create(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    const currentUser = req.user;

    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    if (![Role.ADMIN, Role.MANAGER].includes(currentUser.role)) {
      throw new ForbiddenException('You are not allowed to create users');
    }

    return this.userService.createUser(createUserDto, currentUser.role);
  }

  @Patch('me/profile')
  updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.user_id, updateProfileDto);
  }

  @Patch('me/password')
  updatePassword(
    @Req() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (updatePasswordDto.new_password !== updatePasswordDto.confirm_password) {
      throw new BadRequestException('รหัสผ่านใหม่ไม่ตรงกัน');
    }
    return this.userService.changePassword(req.user.user_id, updatePasswordDto);
  }

  @Patch(':id/toggle-active')
  toggleUserActive(@Param('id') id: string, @Req() req) {
    return this.userService.toggleUserActive(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.userService.updateUser(+id, req.user, updateUserDto);
  }
}
