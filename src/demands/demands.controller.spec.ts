import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';

import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { DemandsService } from './services/demands.service';
import { DemandsController } from './demands.controller';
import { JwtService } from '../jwt/jwt.service';

describe('PlacesController', () => {
  let controller: DemandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandsController],
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
        {
          provide: JwtService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<DemandsController>(DemandsController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });
});
