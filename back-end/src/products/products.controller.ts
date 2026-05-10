import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
        images.map(
          (image) =>
            new Promise<string>((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'products',
                  format: 'webp', //  บังคับแปลงไฟล์ต้นฉบับให้เป็น .webp

                  transformation: [
                    { width: 400, crop: 'limit' }, // ถ้าภาพใหญ่กว่า 1200px จะถูกย่อลงมา
                  ],
                },
                (error, result) => {
                  if (error) return reject(error);

                  // ให้สร้าง URL ใหม่ที่ใส่ Parameter
                  const optimizedUrl = cloudinary.url(result.public_id, {
                    secure: true,
                    format: 'webp',
                    quality: 'auto',
                    width: 400,
                    crop: 'limit',
                  });

                  resolve(optimizedUrl);
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
      //1. ดึงข้อมูล Product เดิมขึ้นมาก่อน
      const existingProduct = await this.productsService.findOne(+id);

      // 2. ลบรูปเก่าออกจาก Cloudinary

      console.log(existingProduct.images);

      if (
        existingProduct &&
        existingProduct.images &&
        existingProduct.images.length > 0
      ) {
        const deleteOldImagesPromises = existingProduct.images.map(
          async (imageObj: any) => {
            const imageUrlString = imageObj.image;

            if (imageUrlString) {
              const parts = imageUrlString.split('/upload/');
              if (parts.length > 1) {
                const afterUpload = parts[1];
                const pathParts = afterUpload.split('/');

                const cleanPathParts = pathParts.filter((part) => {
                  return !part.includes(',') && !/^v\d+$/.test(part);
                });

                const lastPart = cleanPathParts.pop();
                const publicIdWithoutExt = lastPart.split('.')[0].split('?')[0];

                const publicId =
                  cleanPathParts.length > 0
                    ? `${cleanPathParts.join('/')}/${publicIdWithoutExt}`
                    : publicIdWithoutExt;

                try {
                  await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                  console.error(`Error deleting ${publicId}:`, err);
                }
              }
            }
          },
        );

        await Promise.all(deleteOldImagesPromises);
      }
      // 💡 3. อัปโหลดรูปใหม่เข้า Cloudinary
      const uploadedImages = await Promise.all(
        images.map(
          (image) =>
            new Promise<string>((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'products',
                  format: 'webp', // บังคับแปลงไฟล์ให้เป็น .webp
                  transformation: [{ width: 400, crop: 'limit' }],
                },
                (error, result) => {
                  if (error) return reject(error);

                  // สร้าง URL ที่ผ่านการ Optimize
                  const optimizedUrl = cloudinary.url(result.public_id, {
                    secure: true,
                    format: 'webp',
                    quality: 'auto',
                    width: 400,
                    crop: 'limit',
                  });

                  resolve(optimizedUrl);
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
    @Query('onlyActive') onlyActive?: string,
  ) {
    return this.productsService.findAll(
      +page,
      +limit,
      search,
      onlyActive === 'true',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) {
    return this.productsService.toggleActive(+id);
  }
}
