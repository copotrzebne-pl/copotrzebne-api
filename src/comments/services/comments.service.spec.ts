import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CommentsService } from './comments.service';
import { Comment } from '../models/comments.model';
import { PlacesService } from '../../places/services/places.service';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment),
          useValue: jest.fn(),
        },
        {
          provide: PlacesService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
});
