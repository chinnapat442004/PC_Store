import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.userService.findAll();
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
    console.log(createUserDto);
    if (image) {
      createUserDto.image = image.filename;
    } else {
      console.log('not');
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
