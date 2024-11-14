import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productRepository.save(createProductDto);
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
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(product_id: number) {
    const product = await this.productRepository.findOne({
      where: { product_id },
    });
    return await this.productRepository.remove(product);
  }
}
