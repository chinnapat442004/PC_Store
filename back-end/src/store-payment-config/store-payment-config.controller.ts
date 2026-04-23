import { Controller, Get, Body, Patch } from '@nestjs/common';
import { StorePaymentConfigService } from './store-payment-config.service';
import { UpdateStorePaymentConfigDto } from './dto/update-store-payment-config.dto';


@Controller('store-payment-config')
export class StorePaymentConfigController {
  constructor(private readonly configService: StorePaymentConfigService) { }


  @Get()
  getConfig() {
    return this.configService.getConfig();
  }


  @Patch()
  updateConfig(@Body() updateDto: UpdateStorePaymentConfigDto) {
    return this.configService.updateConfig(updateDto);
  }
}