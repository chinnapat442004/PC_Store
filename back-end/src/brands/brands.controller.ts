import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandsService } from './brands.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import cloudinary from 'config/cloudinary.config';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandsService) {}

  @Post()
   @UseInterceptors(
      FilesInterceptor('images', 10, {
        storage: memoryStorage(),
      }),
    )
  async create(@Body() createBrandDto: CreateBrandDto  ,
  @UploadedFiles() images: Express.Multer.File[],) {

     if (images && images.length > 0) {
          const uploadedImages = await Promise.all(
            images.map((image) =>
              new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: 'brands' },
                  (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                  },
                );
    
                stream.end(image.buffer);
              }),
            ),
          );
    
          createBrandDto.logo = uploadedImages[0];;
        }
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
      FilesInterceptor('images', 10, {
        storage: memoryStorage(),
      }),
    )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  @UploadedFiles() images: Express.Multer.File[],
  ) {

        if (images && images.length > 0) {
          const uploadedImages = await Promise.all(
            images.map((image) =>
              new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: 'brands' },
                  (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                  },
                );
    
                stream.end(image.buffer);
              }),
            ),
          );
    
          updateBrandDto.logo = uploadedImages[0];;
        }
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}