import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { ConfigService } from '@nestjs/config';
import { URL } from 'url';

import { Place } from '../../places/models/place.model';

export const getDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => {
  const dbUrl = new URL(configService.get<string>('DATABASE_URL', ''));

  return {
    dialect: 'postgres',
    host: dbUrl.hostname,
    port: +dbUrl.port,
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.split('/')[1],
    synchronize: false,
    models: [Place],
  };
}
