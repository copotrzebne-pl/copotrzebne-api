import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlacesService } from './services/places.service';
import { Place } from './models/place.model';
import { DemandsService } from '../demands/services/demands.service';
import { Demand } from '../demands/models/demand.model';
import { PlacesController } from './controllers/places.controller';
import { UsersPlacesController } from './controllers/users-places.controller';
import { CommentsService } from '../comments/services/comments.service';
import { Comment } from '../comments/models/comment.model';
import { OpeningHoursService } from '../opening-hours/services/opening-hours.service';
import { OpeningHours } from '../opening-hours/models/opening-hours.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Place, Demand, Comment, OpeningHours])],
  providers: [PlacesService, DemandsService, CommentsService, OpeningHoursService],
  controllers: [PlacesController, UsersPlacesController],
  exports: [PlacesService],
})
export class PlacesModule {}
