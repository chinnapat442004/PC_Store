import { Test, TestingModule } from '@nestjs/testing';
import { StorePaymentConfigController } from './store-payment-config.controller';
import { StorePaymentConfigService } from './store-payment-config.service';

describe('StorePaymentConfigController', () => {
  let controller: StorePaymentConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorePaymentConfigController],
      providers: [StorePaymentConfigService],
    }).compile();

    controller = module.get<StorePaymentConfigController>(StorePaymentConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
