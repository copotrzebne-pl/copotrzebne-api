import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PlacesModule } from './places/places.module';
import { getDatabaseConfig } from './config/database/database.config';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { SuppliesModule } from './supplies/supplies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    PlacesModule,
    SuppliesModule,
    UsersModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
