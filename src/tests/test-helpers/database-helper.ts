import { TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

import { Place } from '../../places/models/place.model';
import { User } from '../../users/models/user.model';
import { Journal } from '../../journals/models/journal.model';
import { UsersPlaces } from '../../users/models/users-places.model';
import { Demand } from '../../demands/models/demand.model';
import { Supply } from '../../supplies/models/supply.model';
import { Priority } from '../../priorities/models/priority.model';
import { AnnouncementComment } from '../../announcement-comments/models/announcement-comment.model';
import { UserDraft } from '../../users-drafts/models/user-draft.model';

export class DatabaseHelper {
  constructor(private readonly testingModule: TestingModule) {}

  public readonly placeRepository = this.testingModule.get<typeof Place>(getModelToken(Place));
  public readonly usersRepository = this.testingModule.get<typeof User>(getModelToken(User));
  public readonly journalsRepository = this.testingModule.get<typeof Journal>(getModelToken(Journal));
  public readonly usersPlacesRepository = this.testingModule.get<typeof UsersPlaces>(getModelToken(UsersPlaces));
  public readonly demandsRepository = this.testingModule.get<typeof Demand>(getModelToken(Demand));
  public readonly suppliesRepository = this.testingModule.get<typeof Supply>(getModelToken(Supply));
  public readonly prioritiesRepository = this.testingModule.get<typeof Priority>(getModelToken(Priority));
  public readonly commentsRepository = this.testingModule.get<typeof AnnouncementComment>(
    getModelToken(AnnouncementComment),
  );
  public readonly usersDraftsRepository = this.testingModule.get<typeof UserDraft>(getModelToken(UserDraft));
}
