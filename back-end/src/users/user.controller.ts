import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
  ForbiddenException,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
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
  async getUsers(
    @Req() req: any, // ดึงข้อมูล Request เพื่อเอาข้อมูลคนที่ Login
  ) {
    const currentUser = req.user; // ข้อมูลจาก JWT Token ที่ถอดรหัสแล้ว

    // ---------------------------------------------------
    // กรณีที่ 1: ถ้าเป็น Admin (Super User)
    // ---------------------------------------------------
    if (currentUser.role === Role.ADMIN) {
      // Admin สามารถดูได้ทั้ง Manager และ Employee ของทุกสาขา (ไม่ต้องส่ง branchId)
      return this.userService.findUsersByRole(Role.MANAGER);
    }

    // ---------------------------------------------------
    // กรณีที่ 2: ถ้าเป็น เจ้าของสาขา (Manager)
    // ---------------------------------------------------
    if (currentUser.role) {
      // Manager อนุญาตให้ดูได้แค่ Employee เท่านั้น
      if (currentUser.role !== Role.EMPLOYEE) {
        throw new ForbiddenException('คุณไม่มีสิทธิ์ดูข้อมูลผู้ใช้งานระดับนี้');
      }

      // ส่ง branchId ของตัว Manager เองเข้าไปกรองข้อมูลด้วย
      return this.userService.findUsersByRole(Role.EMPLOYEE);
    }

    // ---------------------------------------------------
    // กรณีที่ 3: ถ้าเป็น พนักงาน (Employee)
    // ---------------------------------------------------
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
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      createUserDto.image = image.filename;
    } else {
    }

    return this.userService.createUser(createUserDto);
  }

  @Post(':id')
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);

    if (!user) {
      throw new Error('User not found');
    }

    // Path ของไฟล์รูปภาพ
    const imagePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'images',
      'users',
      user.image,
    );

    // ลบรูปภาพจากโฟลเดอร์
    fs.unlink(imagePath, (err) => {
      if (err) {
      }
    });

    return this.userService.remove(+id);
  }
}
