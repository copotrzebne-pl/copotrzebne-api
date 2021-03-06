import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PlacesModule } from './places/places.module';
import { getDatabaseConfig } from './config/database/database.config';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { SuppliesModule } from './supplies/supplies.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { DemandsModule } from './demands/demands.module';
import { JwtModule } from './jwt/jwt.module';
import { CategoriesModule } from './categories/categories.module';
import { AddUserToContextMiddleware } from './middleware/add-user-to-context.middleware';
import { AnnouncementCommentsModule } from './announcement-comments/announcement-comments.module';
import { JournalsModule } from './journals/journals.module';
import { PlaceLinksModule } from './place-links/place-links.module';
import { HealthModule } from './health/health.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthenticationModule,
    PlacesModule,
    SuppliesModule,
    PrioritiesModule,
    DemandsModule,
    CategoriesModule,
    PlaceLinksModule,
    JwtModule,
    JournalsModule,
    HealthModule,
    AnnouncementsModule,
    AnnouncementCommentsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddUserToContextMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
