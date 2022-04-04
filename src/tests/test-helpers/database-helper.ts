import { TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { Place } from '../../places/models/place.model';

export class DatabaseHelper {
  constructor(private readonly testingModule: TestingModule) {}

  public readonly placeRepository = this.testingModule.get<typeof Place>(getModelToken(Place));
}
