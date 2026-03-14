import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class BranchsService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branch = this.branchRepository.create(createBranchDto);
    return await this.branchRepository.save(branch);
  }

  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { branch_name: Like(`%${search}%`) },
          // { address: Like(`%${search}%`) },
          // { status: Like(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.branchRepository.findAndCount({
      where,
      skip: skip,
      take: limit,
      order: { branch_name: 'ASC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(branch_id: number) {
    return await this.branchRepository.findOne({
      where: { branch_id },
    });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    await this.branchRepository.update(id, updateBranchDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.branchRepository.delete(id);
  }
}
