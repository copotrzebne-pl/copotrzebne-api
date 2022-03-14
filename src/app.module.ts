import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PlacesModule } from './places/places.module';
import { getDatabaseConfig } from './config/database/database.config';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { SuppliesModule } from './supplies/supplies.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { DemandsModule } from './demands/demands.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthenticationModule,
    PlacesModule,
    SuppliesModule,
    PrioritiesModule,
    DemandsModule,
  ],
})
export class AppModule {}
