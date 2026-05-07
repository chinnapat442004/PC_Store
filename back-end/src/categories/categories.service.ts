import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(onlyActive?: boolean) {
    if (onlyActive) {
      return await this.categoryRepository.find({ where: { is_active: true } });
    }
    return await this.categoryRepository.find();
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
