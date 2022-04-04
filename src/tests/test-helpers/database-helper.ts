import { TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { Place } from '../../places/models/place.model';
import { User } from '../../users/models/user.model';
import { Journal } from '../../journals/models/journal.model';
import { UsersPlaces } from '../../users/models/users-places.model';

export class DatabaseHelper {
  constructor(private readonly testingModule: TestingModule) {}

  public readonly placeRepository = this.testingModule.get<typeof Place>(getModelToken(Place));
  public readonly usersRepository = this.testingModule.get<typeof User>(getModelToken(User));
  public readonly journalsRepository = this.testingModule.get<typeof Journal>(getModelToken(Journal));
  public readonly usersPlacesRepository = this.testingModule.get<typeof UsersPlaces>(getModelToken(UsersPlaces));
}
