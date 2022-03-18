import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';

import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { JwtService } from '../jwt/jwt.service';
import { PrioritiesController } from './priorities.controller';
import { PrioritiesService } from './services/priorities.service';

describe('PrioritiesController', () => {
  let controller: PrioritiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrioritiesController],
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
          provide: PrioritiesService,
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

    controller = module.get<PrioritiesController>(PrioritiesController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });
});
