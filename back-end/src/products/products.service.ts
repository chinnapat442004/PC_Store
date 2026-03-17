import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, Like } from 'typeorm';
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
  const product = this.productRepository.create({
    title: createProductDto.title,
    description: createProductDto.description,
    price: createProductDto.price,
    sold: createProductDto.sold,
    quantity: createProductDto.quantity,
    category: createProductDto.category,
  });

  const savedProduct = await this.productRepository.save(product);

  if (createProductDto.images?.length) {
    const images = createProductDto.images.map((url) =>
      this.imageRepository.create({
        image: url,
        product: savedProduct,
      }),
    );

    await this.imageRepository.save(images);
  }

  return savedProduct;
}

  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { title: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.productRepository.findAndCount({
      where,
      relations: {
        images: true,
        category: true,
      },
      skip: skip,
      take: limit,
      order: {
        category: {
          category_id: 'ASC',
        },
        title: 'ASC',
      },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(product_id: number) {
    return await this.productRepository.findOne({
      where: { product_id },
      relations: { images: true },
    });
  }

async update(product_id: number, updateProductDto: UpdateProductDto) {
  const product = await this.productRepository.findOne({
    where: { product_id },
    relations: ['images'],
  });

  if (!product) {
    throw new Error('Product not found');
  }

  product.title = updateProductDto.title;
  product.description = updateProductDto.description;
  product.price = updateProductDto.price;
  product.sold = updateProductDto.sold;
  product.quantity = updateProductDto.quantity;
  product.category = updateProductDto.category;

  await this.productRepository.save(product);

  if (updateProductDto.images?.length) {
    if (product.images?.length) {
      await this.imageRepository.remove(product.images);
    }

    const images = updateProductDto.images.map((url) =>
      this.imageRepository.create({
        image: url,
        product: product,
      }),
    );

    await this.imageRepository.save(images);
  }

  return product;
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
