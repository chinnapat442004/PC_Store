import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(page = 1, limit = 10, search?: string, onlyActive?: boolean) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (onlyActive) {
      where.is_active = true;
    }

    const [data, total] = await this.categoryRepository.findAndCount({
      where,
      order: {
        category_id: 'ASC',
      },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(category_id: number) {
    return await this.categoryRepository.findOne({ where: { category_id } });
  }

  async update(
    category_id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { category_id },
    });

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async toggleActive(category_id: number) {
    const category = await this.categoryRepository.findOne({
      where: { category_id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.is_active = !category.is_active;

    return await this.categoryRepository.save(category);
  }
}
