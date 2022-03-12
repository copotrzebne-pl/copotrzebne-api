import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PlacesModule } from './places/places.module';
import { getDatabaseConfig } from './config/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    PlacesModule,
  ],
})
export class AppModule {}
