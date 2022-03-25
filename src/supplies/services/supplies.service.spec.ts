import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { SuppliesService } from './supplies.service';
import { Supply } from '../models/supply.model';

describe('SuppliesService', () => {
  let service: SuppliesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliesService,
        {
          provide: getModelToken(Supply),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<SuppliesService>(SuppliesService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
});
