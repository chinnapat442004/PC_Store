import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = new Product();
    // กำหนดข้อมูลของ product จาก DTO
    product.title = createProductDto.title;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.sold = createProductDto.sold;
    product.quantity = createProductDto.quantity;

    const savedProduct = await this.productRepository.save(product);

    if (createProductDto.images && createProductDto.images.length > 0) {
      // สร้าง image instances
      const images = createProductDto.images.map((filename) => {
        const image = this.imageRepository.create({
          image: `/images/products/${filename}`,
          product: product,
        });
        return image;
      });

      await this.imageRepository.save(images);
    }
    return savedProduct;
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(product_id: number) {
    return await this.productRepository.findOne({ where: { product_id } });
  }

  async update(product_id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { product_id },
    });

    if (updateProductDto.images && updateProductDto.images.length > 0) {
      const images = updateProductDto.images.map((filename) => {
        const image = this.imageRepository.create({
          image: `/images/products/${filename}`,
          product: product,
        });
        return image;
      });
      await this.imageRepository.save(images);
      product.title = updateProductDto.title;
      product.description = updateProductDto.description;
      product.price = updateProductDto.price;
      product.sold = updateProductDto.sold;
      product.quantity = updateProductDto.quantity;
      product.category = updateProductDto.category;

      return this.productRepository.save(product);
    }
  }

  async remove(product_id: number) {
    // ค้นหา product ที่จะลบ
    const product = await this.productRepository.findOne({
      where: { product_id },
      relations: ['images'],
    });
    if (!product) {
      throw new Error('Product not found');
    }

    // ลบ images ที่เกี่ยวข้อง
    if (product.images && product.images.length > 0) {
      await this.imageRepository.remove(product.images);
    }

    // ลบ product
    await this.productRepository.remove(product);
  }
}
