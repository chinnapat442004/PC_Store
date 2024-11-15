import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/images/products',
        filename: (req, file, cb) => {
          const filename = uuidv4();
          return cb(null, filename + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    if (images && images.length > 0) {
      createProductDto.images = images.map((image) => image.filename);
    }

    return await this.productsService.create(createProductDto);
  }

  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/images/products',
        filename: (req, file, cb) => {
          const filename = uuidv4();
          return cb(null, filename + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id') id: string,
  ) {
    if (images && images.length > 0) {
      updateProductDto.images = images.map((image) => image.filename);
    }

    return await this.productsService.update(+id, updateProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          '..',
          '..',
          'public',
          'images',
          'users',
          image.image,
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          } else {
            console.log('Image deleted successfully');
          }
        });
      });
    }
    return this.productsService.remove(+id);
  }
}
