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
import { PlacesStateMachine } from './services/state-machine/places.state-machine';
import { UsersDraftsModule } from '../users-drafts/users-drafts.module';
import { Link } from '../links/models/link.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Place, Demand, Comment, Link]), UsersDraftsModule],
  providers: [PlacesService, DemandsService, CommentsService, PlacesStateMachine],
  controllers: [PlacesController, UsersPlacesController],
  exports: [PlacesService],
})
export class PlacesModule {}
