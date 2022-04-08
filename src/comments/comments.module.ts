import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './comments.controller';
import { PlacesService } from '../places/services/places.service';
import { Place } from '../places/models/place.model';
import { PlaceStateMachine } from '../places/services/state-machine/places.state-machine';

@Module({
  imports: [SequelizeModule.forFeature([Comment, Place])],
  providers: [CommentsService, PlacesService, PlaceStateMachine],
  controllers: [CommentsController],
})
export class CommentsModule {}
