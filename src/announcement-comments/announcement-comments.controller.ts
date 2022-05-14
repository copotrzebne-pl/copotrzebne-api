import {
  Body,
  Controller,
  Delete,
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
import { AnnouncementCommentsService } from './services/announcement-comments.service';
import { AnnouncementComment } from './models/announcement-comment.model';
import { CreateAnnouncementCommentDto } from './dto/create-announcement-comment.dto';
import { UpdateAnnouncementCommentDto } from './dto/update-announcement-comment.dto';
import { PlacesService } from '../places/services/places.service';
import { AuthorizationError } from '../error/authorization.error';
import { SessionUser } from '../decorators/session-user.decorator';
import { User } from '../users/models/user.model';
import { AnnouncementsService } from '../announcements/services/announcements.service';

@ApiTags('announcement-comments')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('announcement-comments')
export class AnnouncementCommentsController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly commentsService: AnnouncementCommentsService,
    private readonly placesService: PlacesService,
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @ApiResponse({ type: AnnouncementComment, description: 'creates comment and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createAnnouncementComment(
    @SessionUser() user: User,
    @Body() commentDto: CreateAnnouncementCommentDto,
  ): Promise<AnnouncementComment | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const announcement = await this.announcementsService.getInternalAnnouncementById(
        transaction,
        commentDto.internalAnnouncementId,
      );

      if (!announcement) {
        throw new NotFoundError('ANNOUNCEMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        announcement.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const comment = await this.commentsService.createComment(transaction, commentDto);

      if (!comment) {
        throw new CRUDError('CANNOT_CREATE_COMMENT');
      }

      return comment;
    });
  }

  @ApiResponse({ type: AnnouncementComment, description: 'updates comment and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateAnnouncementComment(
    @SessionUser() user: User,
    @Param('id') id: string,
    @Body() commentDto: UpdateAnnouncementCommentDto,
  ): Promise<AnnouncementComment | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const comment = await this.commentsService.getCommentById(transaction, id);

      if (!comment) {
        throw new NotFoundError('COMMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        comment.internalAnnouncement.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const updatedComment = await this.commentsService.updateComment(transaction, id, commentDto);

      if (!updatedComment) {
        throw new CRUDError('CANNOT_UPDATE_COMMENT');
      }

      return updatedComment;
    });
  }

  @ApiResponse({ status: 204, description: 'deletes comment and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async deleteAnnouncementComment(@SessionUser() user: User, @Param('id') id: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      const comment = await this.commentsService.getCommentById(transaction, id);

      if (!comment) {
        throw new NotFoundError('COMMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        comment.internalAnnouncement.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      await this.commentsService.deleteComment(transaction, id);
    });
  }
}
