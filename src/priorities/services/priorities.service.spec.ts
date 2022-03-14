import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { PrioritiesService } from './priorities.service';
import { Priority } from '../models/priorities.model';

describe('PrioritiesService', () => {
  let service: PrioritiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrioritiesService,
        {
          provide: getModelToken(Priority),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<PrioritiesService>(PrioritiesService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
});
