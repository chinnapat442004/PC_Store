import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  // Delete,
  UploadedFile,
  UseInterceptors,
  Req,
  ForbiddenException,
  UseGuards,
  Query,
  Patch,
  // UseGuards,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { Role } from './enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
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

    if (currentUser.role) {
      if (currentUser.role !== Role.STAFF) {
        throw new ForbiddenException('คุณไม่มีสิทธิ์ดูข้อมูลผู้ใช้งานระดับนี้');
      }

      return this.userService.findUsersByRole(
        Role.STAFF,
        +page,
        +limit,
        search,
      );
    }

    throw new ForbiddenException('พนักงานไม่มีสิทธิ์เข้าถึงข้อมูลผู้ใช้งาน');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images/users',
        filename: (req, image, cd) => {
          const name = uuidv4();
          return cd(null, name + extname(image.originalname));
        },
      }),
    }),
  )
  async create(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      createUserDto.image = image.filename;
    }

    const creatorRole = req.user.role;

    return this.userService.createUser(createUserDto, creatorRole);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images/users', 
        filename: (req, image, cd) => {
    
          return cd(null, name + extname(image.originalname));
        },
      }),
    }),
  )
  update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (image) {
      updateUserDto.image = image.filename;
    }

    return this.userService.update(+id, updateUserDto);
  }


}
