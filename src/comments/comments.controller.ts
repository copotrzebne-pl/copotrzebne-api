import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import CRUDError from '../error/crud.error';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { AuthGuard } from '../guards/authentication.guard';
import NotFoundError from '../error/not-found.error';
import { ErrorHandler } from '../error/error-handler';
import { CommentsService } from './services/comments.service';
import { Comment } from './models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PlacesService } from '../places/services/places.service';
import { AuthorizationError } from '../error/authorization.error';
import { SessionUser } from '../decorators/session-user.decorator';
import { User } from '../users/models/user.model';
import { Action } from '../journals/types/action.enum';
import { JournalsService } from '../journals/services/journals.service';

@ApiTags('comments')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly commentsService: CommentsService,
    private readonly placesService: PlacesService,
    private readonly journalsService: JournalsService,
  ) {}

  @ApiResponse({ isArray: true, type: Comment, description: 'returns single comment' })
  @Get('/:id')
  public async getComment(@Param('id') id: string): Promise<Comment | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const comment = await this.commentsService.getCommentById(transaction, id);

      if (!comment) {
        throw new NotFoundError(`COMMENT_NOT_FOUND`);
      }

      return comment;
    });
  }

  @ApiResponse({ type: Comment, description: 'creates comment and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createComment(@SessionUser() user: User, @Body() commentDto: CreateCommentDto): Promise<Comment | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        commentDto.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const comment = await this.commentsService.createComment(transaction, commentDto);

      if (!comment) {
        throw new CRUDError('CANNOT_CREATE_COMMENT');
      }

      this.journalsService.logInJournal({
        action: Action.ADD_COMMENT,
        userId: user.id,
        details: `New comment ${comment.id} added to place ${commentDto.placeId}`,
      });

      return comment;
    });
  }

  @ApiResponse({ type: Comment, description: 'updates comment and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateComment(
    @SessionUser() user: User,
    @Param('id') id: string,
    @Body() commentDto: UpdateCommentDto,
  ): Promise<Comment | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const comment = await this.commentsService.getCommentById(transaction, id);

      if (!comment) {
        throw new NotFoundError('COMMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        comment.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const updatedComment = await this.commentsService.updateComment(transaction, id, commentDto);

      if (!updatedComment) {
        throw new CRUDError('CANNOT_UPDATE_COMMENT');
      }

      this.journalsService.logInJournal({
        action: Action.EDIT_COMMENT,
        userId: user.id,
        details: `Comment ${comment.id} for place ${updatedComment.placeId}`,
      });

      return updatedComment;
    });
  }

  @ApiResponse({ status: 204, description: 'deletes comment and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async deleteComment(@SessionUser() user: User, @Param('id') id: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      const comment = await this.commentsService.getCommentById(transaction, id);

      if (!comment) {
        throw new NotFoundError('COMMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        comment.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      this.journalsService.logInJournal({
        action: Action.DELETE_COMMENT,
        userId: user.id,
        details: `Comment ${id} removed from ${comment.placeId}`,
      });

      await this.commentsService.deleteComment(transaction, id);
    });
  }
}
