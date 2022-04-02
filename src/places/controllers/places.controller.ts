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
  Query,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiHeader, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PlacesService } from '../services/places.service';
import { Place } from '../models/place.model';
import { AuthGuard } from '../../guards/authentication.guard';
import { MetadataKey } from '../../types/metadata-key.enum';
import { UserRole } from '../../users/types/user-role.enum';
import { Demand } from '../../demands/models/demand.model';
import { DemandsService } from '../../demands/services/demands.service';
import CRUDError from '../../error/crud.error';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import { UsersService } from '../../users/users.service';
import { AuthorizationError } from '../../error/authorization.error';
import NotFoundError from '../../error/not-found.error';
import { ErrorHandler } from '../../error/error-handler';
import { Language } from '../../types/language.type.enum';
import { Comment } from '../../comments/models/comment.model';
import { CommentsService } from '../../comments/services/comments.service';
import { SessionUser } from '../../decorators/session-user.decorator';
import { User } from '../../users/models/user.model';

@ApiTags('places')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('places')
export class PlacesController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly placesService: PlacesService,
    private readonly demandsService: DemandsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
  ) {}

  @ApiResponse({ isArray: true, type: Place, description: 'returns single place' })
  @Get('/:id')
  public async getPlace(@Param('id') id: string): Promise<Place | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const place = await this.placesService.getPlaceById(transaction, id);

      if (!place) {
        throw new NotFoundError('PLACE_NOT_FOUND');
      }

      return place;
    });
  }

  @ApiQuery({ name: 'supply', type: String })
  @ApiResponse({
    isArray: true,
    type: Place,
    description:
      'if query param "supplyId" is given - returns all places with demands for specific supply; if not - returns all places',
  })
  @Get('/')
  public async getPlaces(@Query('supplyId') supplyId?: string): Promise<Place[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      if (supplyId) {
        return await this.placesService.getPlacesWithSupply(transaction, supplyId);
      }

      return await this.placesService.getAllPlaces(transaction);
    });
  }

  @ApiQuery({ name: 'sort', enum: Language })
  @ApiResponse({ isArray: true, type: Demand, description: 'returns all demands for place' })
  @Get(':id/demands')
  public async getDemandsForPlace(@Param('id') id: string, @Query('sort') sort?: Language): Promise<Demand[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.demandsService.getDetailedDemandsForPlace(transaction, id, sort);
    });
  }

  @ApiResponse({ isArray: true, type: Comment, description: 'returns all comments for place' })
  @Get(':id/comments')
  public async getCommentsForPlace(@Param('id') id: string): Promise<Comment[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.commentsService.getCommentsForPlace(transaction, id);
    });
  }

  @ApiResponse({ status: 204, description: 'deletes all demands for place' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/demands')
  public async deleteDemandsForPlace(@SessionUser() user: User, @Param('id') placeId: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(transaction, user, placeId);
      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      await this.demandsService.deleteAllDemandsForPlace(transaction, placeId);
    });
  }

  @ApiResponse({ type: Place, description: 'creates place and returns created entity' })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createPlace(@SessionUser() user: User, @Body() placeDto: CreatePlaceDto): Promise<Place | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const place = await this.placesService.createPlace(transaction, placeDto);

      if (!place) {
        throw new NotFoundError();
      }

      return place;
    });
  }

  @ApiResponse({ type: Place, description: 'updates place and returns updated entity' })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updatePlace(
    @SessionUser() user: User,
    @Param('id') placeId: string,
    @Body() placeDto: UpdatePlaceDto,
  ): Promise<Place | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const isPlaceManageableByUser = await this.placesService.isPlaceManageableByUser(transaction, user, placeId);

      if (!isPlaceManageableByUser) {
        throw new AuthorizationError();
      }

      const place = await this.placesService.updatePlace(transaction, placeId, placeDto);

      if (!place) {
        throw new CRUDError('CANNOT_UPDATE_PLACE');
      }

      return place;
    });
  }

  @ApiResponse({ status: 204, description: 'deletes place and returns empty response. Allowed only for admin' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async deletePlace(@Param('id') id: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      const place = await this.placesService.getPlaceById(transaction, id);

      if (!place) {
        throw new NotFoundError('PLACE_NOT_FOUND');
      }

      await this.placesService.deletePlace(transaction, id);
    });
  }

  @ApiResponse({
    type: Place,
    isArray: true,
    description: 'Returns list of owned places for user. Only accessibe by admins.',
  })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Get('/owned/:userId')
  public async getOwnedPlacesByUserId(@Param('userId') userId: string): Promise<Place[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.placesService.getUserPlaces(transaction, userId);
    });
  }
}
