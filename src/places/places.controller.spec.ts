import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';

import { PlacesController } from './places.controller';
import { PlacesService } from './services/places.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { DemandsService } from '../demands/services/demands.service';

describe('PlacesController', () => {
  let controller: PlacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        {
          provide: UsersService,
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(User),
          useValue: jest.fn(),
        },
        {
          provide: PlacesService,
          useValue: jest.fn(),
        },
        {
          provide: DemandsService,
          useValue: jest.fn(),
        },
        {
          provide: Sequelize,
          useValue: jest.fn(),
        },
        {
          provide: ConfigService,
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
