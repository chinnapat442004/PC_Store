import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class CouponService {

  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,

  ) { }
  create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto)
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,) {
    const skip = (page - 1) * limit;
    let where: any = {};
    if (search) {
      where = [
        { code: Like(`%${search}%`) }
      ];
    }
    const [data, total] = await this.couponRepository.findAndCount({
      where, skip,
      take: limit,
    })
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  }


  async findOne(coupon_id: number) {
    return await this.couponRepository.findOne({
      where: { coupon_id },
    });
  }

  async update(coupon_id: number, updateCouponDto: UpdateCouponDto) {

    const coupon = await this.couponRepository.findOne({
      where: { coupon_id },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with id ${coupon_id} not found`);

    }

    Object.assign(coupon, updateCouponDto);
    return await this.couponRepository.save(coupon)
  }


  async toggleActive(coupon_id: number) {
    const coupon = await this.couponRepository.findOne({
      where: { coupon_id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    coupon.is_active = !coupon.is_active;

    return this.couponRepository.save(coupon);
  }



}
