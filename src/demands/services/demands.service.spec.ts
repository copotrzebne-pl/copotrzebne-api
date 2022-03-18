import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DemandsService } from './demands.service';
import { Demand } from '../models/demands.model';

describe('DemandsService', () => {
  let service: DemandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemandsService,
        {
          provide: getModelToken(Demand),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<DemandsService>(DemandsService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
});
