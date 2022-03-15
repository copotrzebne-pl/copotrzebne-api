import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './services/supplies.service';
import { Supply } from './models/supplies.model';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';

describe('SuppliesController', () => {
  let controller: SuppliesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliesController],
      providers: [
        {
          provide: UsersService,
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(Supply),
          useValue: jest.fn(),
        },
        {
          provide: SuppliesService,
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

    controller = module.get<SuppliesController>(SuppliesController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });
});
