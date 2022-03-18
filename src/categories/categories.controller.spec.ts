import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';

import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { JwtService } from '../jwt/jwt.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './services/categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
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
          provide: CategoriesService,
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

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });
});
