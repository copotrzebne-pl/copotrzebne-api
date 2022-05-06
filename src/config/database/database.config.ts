import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { ConfigService } from '@nestjs/config';
import { URL } from 'url';

import { Place } from '../../places/models/place.model';
import { User } from '../../users/models/user.model';
import { Demand } from '../../demands/models/demand.model';
import { Supply } from '../../supplies/models/supply.model';
import { Priority } from '../../priorities/models/priority.model';
import { UsersPlaces } from '../../users/models/users-places.model';
import { Category } from '../../categories/models/category.model';
import { Journal } from '../../journals/models/journal.model';
import { UserDraft } from '../../users-drafts/models/user-draft.model';
import { PlaceLink } from '../../place-links/models/place-link.model';
import { PublicAnnouncement } from '../../announcements/models/public-announcement.model';
import { InternalAnnouncement } from '../../announcements/models/internal-announcement.model';
import { AnnouncementComment } from '../../announcement-comments/models/announcement-comment.model';

export const getDatabaseConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const options: SequelizeModuleOptions = {
    dialect: 'postgres',
    synchronize: false,
    models: [
      User,
      UserDraft,
      Place,
      PlaceLink,
      Demand,
      Supply,
      Priority,
      UsersPlaces,
      Category,
      Journal,
      PublicAnnouncement,
      InternalAnnouncement,
      AnnouncementComment,
    ],
  };

  const databaseUrl = configService.get<string>('DATABASE_URL', '');
  if (databaseUrl) {
    const dbUrl = new URL(databaseUrl);
    options.host = dbUrl.hostname;
    options.port = +dbUrl.port;
    options.username = dbUrl.username;
    options.password = dbUrl.password;
    options.database = dbUrl.pathname.split('/')[1];
    options.dialectOptions = { ssl: { require: true, rejectUnauthorized: false } };
  } else {
    options.host = configService.get<string>('API_DB_HOST', '');
    options.port = configService.get<number>('API_DB_PORT', 3000);
    options.username = configService.get<string>('API_DB_USERNAME', '');
    options.password = configService.get<string>('API_DB_PWD', '');
    options.database = configService.get<string>('API_DB_DATABASE', '');
    options.logging = process.env.NODE_ENV !== 'test';
  }

  return options;
};
