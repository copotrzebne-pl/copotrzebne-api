import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './comments.controller';
import { PlacesService } from '../places/services/places.service';
import { Place } from '../places/models/place.model';
import { PlacesStateMachine } from '../places/services/state-machine/places.state-machine';
import { Link } from '../links/models/link.model';

@Module({
  imports: [SequelizeModule.forFeature([Comment, Link, Place])],
  providers: [CommentsService, PlacesService, PlacesStateMachine],
  controllers: [CommentsController],
})
export class CommentsModule {}
