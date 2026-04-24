import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, Like } from 'typeorm';
import { Image } from './entities/image.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Stock } from 'src/stock/entities/stock.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = new Product();

    product.title = createProductDto.title;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.sold = 0;

    if (createProductDto.categoryId) {
      product.category = {
        category_id: createProductDto.categoryId,
      } as any
    }

    const savedProduct = await this.productRepository.save(product);

    if (createProductDto.images?.length) {
      const images = createProductDto.images.map((url) =>
        this.imageRepository.create({
          image: url,
          product: savedProduct,
        }),
      );

      await this.imageRepository.save(images);

      const branches = await this.branchRepository.find()

      const stocks = branches.map((branch) =>
        this.stockRepository.create({
          product_id: savedProduct.product_id,
          branch_id: branch.branch_id,
          quantity: 0,
        }),
      )
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
        stocks: true,
      },
      skip,
      take: limit,
      order: {
        category: {
          category_id: 'ASC',
        },
        title: 'ASC',
      },
    });

    const dataWithStock = data.map((product) => {

      const stock_quantity =
        product.stocks?.reduce((sum, s) => sum + s.quantity, 0) || 0;

      const { stocks, ...restProduct } = product;


      return {
        ...restProduct,
        stock_quantity,
      };
    });

    return {
      data: dataWithStock,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

async findOne(product_id: number) {
  const product = await this.productRepository.findOne({
    where: { product_id },
    relations: {
      images: true,
      category: true,
      stocks: true,
    },
  });

  if (!product) return null;

  const stock_quantity =
    product.stocks?.reduce((sum, s) => sum + s.quantity, 0) || 0;

  const { stocks, ...restProduct } = product;

  return {
    ...restProduct,
    stock_quantity,
  };
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

    if (updateProductDto.categoryId) {
      product.category = {
        category_id: updateProductDto.categoryId,
      } as any
    }
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
    const product = await this.productRepository.findOne({
      where: { product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);

    return { message: 'Product deleted successfully' };
  }
}
