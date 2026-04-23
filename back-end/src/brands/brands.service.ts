import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) { }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = new Brand();
    brand.name = createBrandDto.name
    brand.logo = createBrandDto.logo
    return await this.brandRepository.save(brand);
  }



  async findAll(): Promise<Brand[]> {
    return await this.brandRepository.find();
  }

  async findOne(brand_id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { brand_id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    Object.assign(brand, updateBrandDto);
    return await this.brandRepository.save(brand);
  }

  async remove(id: number): Promise<{ message: string }> {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    return { message: 'Brand deleted successfully' };
  }
}