import { Test, TestingModule } from '@nestjs/testing';

import { BrandsService } from './brands.service';
import { BrandController } from './brands.controller';

describe('BrandsController', () => {
  let controller: BrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [BrandsService],
    }).compile();

    controller = module.get<BrandController>(BrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
