import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { PlacesService } from './places.service';
import { Place } from './models/place.model';

describe('PlacesService', () => {
  let service: PlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        {
          provide: getModelToken(Place),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
});
