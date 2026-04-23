import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
  ) { }


  async create(data: Partial<Shipment>) {
    const shipment = this.shipmentRepository.create(data);
    return await this.shipmentRepository.save(shipment);
  }


  async findAll(search?: string) {
    const where = search
      ? { name: Like(`%${search}%`) }
      : {};

    return await this.shipmentRepository.find({
      where,
      order: {
        shipment_id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const shipment = await this.shipmentRepository.findOne({
      where: { shipment_id: id },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }


  async update(id: number, data: Partial<Shipment>) {
    const shipment = await this.findOne(id);

    Object.assign(shipment, data);

    return await this.shipmentRepository.save(shipment);
  }


  async remove(id: number) {
    const shipment = await this.findOne(id);

    return await this.shipmentRepository.remove(shipment);
  }
}