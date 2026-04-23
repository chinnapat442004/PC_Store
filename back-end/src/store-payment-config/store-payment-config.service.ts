import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorePaymentConfig } from './entities/store-payment-config.entity';
import { UpdateStorePaymentConfigDto } from './dto/update-store-payment-config.dto';



@Injectable()
export class StorePaymentConfigService {
  constructor(
    @InjectRepository(StorePaymentConfig)
    private readonly configRepo: Repository<StorePaymentConfig>,
  ) { }


  async getConfig(): Promise<StorePaymentConfig> {

    let config = await this.configRepo.findOne({ where: { id: 1 } });


    if (!config) {
      const newConfig = this.configRepo.create({
        promptpay_number: '0000000000',
        account_name: 'ยังไม่ได้ตั้งค่าชื่อบัญชี',
      });
      config = await this.configRepo.save(newConfig);
    }

    return config;
  }


  async updateConfig(updateDto: UpdateStorePaymentConfigDto): Promise<StorePaymentConfig> {

    const config = await this.getConfig();
    const updatedConfig = this.configRepo.merge(config, updateDto);
    return await this.configRepo.save(updatedConfig);
  }
}