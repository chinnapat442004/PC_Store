import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorePaymentConfigService } from './store-payment-config.service';
import { StorePaymentConfigController } from './store-payment-config.controller';
import { StorePaymentConfig } from './entities/store-payment-config.entity';

@Module({

  imports: [TypeOrmModule.forFeature([StorePaymentConfig])],
  controllers: [StorePaymentConfigController],
  providers: [StorePaymentConfigService],
  exports: [StorePaymentConfigService],
})
export class StorePaymentConfigModule { }