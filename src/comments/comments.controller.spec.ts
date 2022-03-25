import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';
import { CommentsController } from './comments.controller';
import { Comment } from './models/comment.model';
import { CommentsService } from './services/comments.service';
import { PlacesService } from '../places/services/places.service';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: UsersService,
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(Comment),
          useValue: jest.fn(),
        },
        {
          provide: CommentsService,
          useValue: jest.fn(),
        },
        {
          provide: PlacesService,
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

    controller = module.get<CommentsController>(CommentsController);
  });

  it('is defined', () => {
    expect(controller).toBeDefined();
  });
});
