import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    return await this.branchRepository.find();
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
