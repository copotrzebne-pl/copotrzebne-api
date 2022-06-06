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
import CRUDError from '../../error/crud.error';
import { MetadataKey } from '../../types/metadata-key.enum';
import { UserRole } from '../../users/types/user-role.enum';
import { AuthGuard } from '../../guards/authentication.guard';
import NotFoundError from '../../error/not-found.error';
import { ErrorHandler } from '../../error/error-handler';
import { PlacesService } from '../../places/services/places.service';
import { AuthorizationError } from '../../error/authorization.error';
import { SessionUser } from '../../decorators/session-user.decorator';
import { User } from '../../users/models/user.model';
import { AnnouncementsService } from '../services/announcements.service';
import { PublicAnnouncement } from '../models/public-announcement.model';
import { InternalAnnouncement } from '../models/internal-announcement.model';
import { CreatePublicAnnouncementDto } from '../dto/create-public-announcement.dto';
import { CreateInternalAnnouncementDto } from '../dto/create-internal-announcement.dto';
import { UpdatePublicAnnouncementDto } from '../dto/update-public-announcement.dto';
import { UpdateInternalAnnouncementDto } from '../dto/update-internal-announcement.dto';

@ApiTags('announcements')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('announcements')
export class AnnouncementsController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly announcementsService: AnnouncementsService,
    private readonly placesService: PlacesService,
  ) {}

  @ApiResponse({ isArray: true, type: PublicAnnouncement, description: 'returns public announcements' })
  @Get('/public')
  public async getPublicAnnouncements(): Promise<PublicAnnouncement[]> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.announcementsService.getPublicAnnouncements(transaction);
    });
  }

  @ApiResponse({ isArray: true, type: InternalAnnouncement, description: 'returns internal announcements' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.PLACE_MANAGER,
    UserRole.AUDITOR,
  ])
  @UseGuards(AuthGuard)
  @Get('/internal')
  public async getInternalAnnouncements(): Promise<InternalAnnouncement[]> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.announcementsService.getInternalAnnouncements(transaction);
    });
  }

  @ApiResponse({
    isArray: true,
    type: InternalAnnouncement,
    description: 'returns only active internal announcements (by start and end date)',
  })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.PLACE_MANAGER,
    UserRole.AUDITOR,
  ])
  @UseGuards(AuthGuard)
  @Get('/internal/active')
  public async getActiveInternalAnnouncements(): Promise<InternalAnnouncement[]> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.announcementsService.getActiveInternalAnnouncements(transaction);
    });
  }

  @ApiResponse({ type: PublicAnnouncement, description: 'returns single public announcement found by id' })
  @Get('/public/:id')
  public async getPublicAnnouncement(@Param('id') id: string): Promise<PublicAnnouncement | null> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.announcementsService.getPublicAnnouncementById(transaction, id);
    });
  }

  @ApiResponse({ type: InternalAnnouncement, description: 'returns single internal announcement found by id' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.PLACE_MANAGER,
    UserRole.AUDITOR,
  ])
  @UseGuards(AuthGuard)
  @Get('/internal/:id')
  public async getInternalAnnouncement(@Param('id') id: string): Promise<InternalAnnouncement | null> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.announcementsService.getInternalAnnouncementById(transaction, id);
    });
  }

  @ApiResponse({ type: PublicAnnouncement, description: 'creates public announcement and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.MODERATOR, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Post('/public')
  public async createPublicAnnouncement(
    @SessionUser() user: User,
    @Body() publicAnnouncementDto: CreatePublicAnnouncementDto,
  ): Promise<PublicAnnouncement | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        publicAnnouncementDto.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const announcement = await this.announcementsService.createPublicAnnouncement(transaction, publicAnnouncementDto);

      if (!announcement) {
        throw new CRUDError('CANNOT_CREATE_PUBLIC_ANNOUNCEMENT');
      }

      return announcement;
    });
  }

  @ApiResponse({ type: InternalAnnouncement, description: 'creates internal announcement and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.MODERATOR, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Post('/internal')
  public async createInternalAnnouncement(
    @SessionUser() user: User,
    @Body() internalAnnouncementDto: CreateInternalAnnouncementDto,
  ): Promise<InternalAnnouncement | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        internalAnnouncementDto.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const announcement = await this.announcementsService.createInternalAnnouncement(
        transaction,
        internalAnnouncementDto,
      );

      if (!announcement) {
        throw new CRUDError('CANNOT_CREATE_INTERNAL_ANNOUNCEMENT');
      }

      return announcement;
    });
  }

  @ApiResponse({ type: PublicAnnouncement, description: 'updates public announcement and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.MODERATOR, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/public/:id')
  public async updatePublicAnnouncementDto(
    @SessionUser() user: User,
    @Param('id') id: string,
    @Body() publicAnnouncementDto: UpdatePublicAnnouncementDto,
  ): Promise<PublicAnnouncement | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const announcement = await this.announcementsService.getPublicAnnouncementById(transaction, id);

      if (!announcement) {
        throw new NotFoundError('PUBLIC_ANNOUNCEMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        announcement.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const updatedAnnouncement = await this.announcementsService.updatePublicAnnouncement(
        transaction,
        id,
        publicAnnouncementDto,
      );

      if (!updatedAnnouncement) {
        throw new CRUDError('CANNOT_UPDATE_PUBLIC_ANNOUNCEMENT');
      }

      return updatedAnnouncement;
    });
  }

  @ApiResponse({ type: InternalAnnouncement, description: 'updates internal announcement and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.MODERATOR, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/internal/:id')
  public async updateInternalAnnouncementDto(
    @SessionUser() user: User,
    @Param('id') id: string,
    @Body() internalAnnouncementDto: UpdateInternalAnnouncementDto,
  ): Promise<InternalAnnouncement | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const announcement = await this.announcementsService.getInternalAnnouncementById(transaction, id);

      if (!announcement) {
        throw new NotFoundError('INTERNAL_ANNOUNCEMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        announcement.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const updatedAnnouncement = await this.announcementsService.updateInternalAnnouncement(
        transaction,
        id,
        internalAnnouncementDto,
      );

      if (!updatedAnnouncement) {
        throw new CRUDError('CANNOT_UPDATE_INTERNAL_ANNOUNCEMENT');
      }

      return updatedAnnouncement;
    });
  }

  @ApiResponse({ status: 204, description: 'deletes public announcement and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.MODERATOR, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/public/:id')
  public async deletePublicAnnouncement(@SessionUser() user: User, @Param('id') id: string): Promise<void> {
    await this.sequelize.transaction(async (transaction): Promise<void> => {
      const announcement = await this.announcementsService.getPublicAnnouncementById(transaction, id);

      if (!announcement) {
        throw new NotFoundError('PUBLIC_ANNOUNCEMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        announcement.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      await this.announcementsService.deletePublicAnnouncement(transaction, id);
    });
  }

  @ApiResponse({ status: 204, description: 'deletes internal announcement and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.MODERATOR, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/internal/:id')
  public async deleteInternalAnnouncement(@SessionUser() user: User, @Param('id') id: string): Promise<void> {
    await this.sequelize.transaction(async (transaction): Promise<void> => {
      const announcement = await this.announcementsService.getInternalAnnouncementById(transaction, id);

      if (!announcement) {
        throw new NotFoundError('INTERNAL_ANNOUNCEMENT_NOT_FOUND');
      }

      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(
        transaction,
        user,
        announcement.placeId,
      );

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      await this.announcementsService.deleteInternalAnnouncement(transaction, id);
    });
  }
}
