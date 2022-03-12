import { Test, TestingModule } from '@nestjs/testing';

import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Sequelize } from 'sequelize-typescript';

describe('PlacesController', () => {
  let controller: PlacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        {
          provide: PlacesService,
          useValue: jest.fn(),
        },
        {
          provide: Sequelize,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<PlacesController>(PlacesController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });
});
