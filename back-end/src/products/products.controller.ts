import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import cloudinary from 'config/cloudinary.config';
import path from 'path';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    if (images && images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((image) =>
          new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              },
            );

            stream.end(image.buffer);
          }),
        ),
      );

      createProductDto.images = uploadedImages;
    }

    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id') id: string,
  ) {
    if (images && images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((image) =>
          new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              },
            );

            stream.end(image.buffer);
          }),
        ),
      );

      updateProductDto.images = uploadedImages;
    }

    return this.productsService.update(+id, updateProductDto);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search: string,
  ) {
    return this.productsService.findAll(+page, +limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}