import { Test, TestingModule } from '@nestjs/testing';
import { StorePaymentConfigService } from './store-payment-config.service';

describe('StorePaymentConfigService', () => {
  let service: StorePaymentConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorePaymentConfigService],
    }).compile();

    service = module.get<StorePaymentConfigService>(StorePaymentConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
