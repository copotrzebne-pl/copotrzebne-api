import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CategoriesService } from './categories.service';
import { Category } from '../models/category.model';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
});
