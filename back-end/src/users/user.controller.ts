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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
  async create(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto,
  ) {
    const currentUser = req.user;

    if (![Role.ADMIN, Role.MANAGER].includes(currentUser.role)) {
      throw new ForbiddenException('You are not allowed to create users');
    }

    createUserDto.branch_id = currentUser.branch_id;


    return this.userService.createUser(createUserDto, currentUser);
  }




  @Patch(':id')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.userService.update(+id, updateUserDto);
  }
}