import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { ConfigService } from '@nestjs/config';

import { Place } from '../../places/models/place.model';

export const getDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: configService.get<string>('API_DB_HOST', ''),
  port: configService.get<number>('API_DB_PORT', 3000),
  username: configService.get<string>('API_DB_USERNAME', ''),
  password: configService.get<string>('API_DB_PWD', ''),
  database: configService.get<string>('API_DB_DATABASE', ''),
  synchronize: false,
  models: [Place],
});
