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
// import * as fs from 'fs';
// import * as path from 'path';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { AuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }
  // @UseGuards(AuthGuard)
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

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
      if (currentUser.role !== Role.EMPLOYEE) {
        throw new ForbiddenException('คุณไม่มีสิทธิ์ดูข้อมูลผู้ใช้งานระดับนี้');
      }

      return this.userService.findUsersByRole(
        Role.EMPLOYEE,
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
        destination: './public/images/users', // โฟลเดอร์เก็บภาพโปรไฟล์
        filename: (req, image, cd) => {
          // const uniqueSuffix =
          //   Date.now() + '-' + Math.round(Math.random() * 1e9);
          // const ext = extname(image.originalname);
          const name = uuidv4();
          // return cd(null, `${image.fieldname}-${uniqueSuffix}${ext}`);
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

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const user = await this.userService.findOne(+id);

  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   // Path ของไฟล์รูปภาพ
  //   const imagePath = path.join(
  //     __dirname,
  //     '..',
  //     '..',
  //     'public',
  //     'images',
  //     'users',
  //     user.image,
  //   );

  //   // ลบรูปภาพจากโฟลเดอร์
  //   fs.unlink(imagePath, (err) => {
  //     if (err) {
  //     }
  //   });

  //   return this.userService.remove(+id);
  // }
}
