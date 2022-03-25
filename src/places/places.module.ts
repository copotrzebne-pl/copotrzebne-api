import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlacesService } from './services/places.service';
import { Place } from './models/places.model';
import { DemandsService } from '../demands/services/demands.service';
import { Demand } from '../demands/models/demands.model';
import { PlacesController } from './controllers/places.controller';
import { UsersPlacesController } from './controllers/users-places.controller';
import { CommentsService } from '../comments/services/comments.service';
import { Comment } from '../comments/models/comments.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Place, Demand, Comment])],
  providers: [PlacesService, DemandsService, CommentsService],
  controllers: [PlacesController, UsersPlacesController],
  exports: [PlacesService],
})
export class PlacesModule {}
