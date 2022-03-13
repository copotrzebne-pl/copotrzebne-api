import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { AuthenticationService } from './authentication.service';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        ConfigService,
        UsersService,
        { provide: getModelToken(User), useValue: jest.fn() },
        {
          provide: Sequelize,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
});
