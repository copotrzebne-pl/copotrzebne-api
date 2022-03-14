import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';

import { AuthenticationService } from './authentication.service';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        ConfigService,
        { provide: JwtService, useValue: jest.fn() },
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
