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
import { PerformPlaceTransitionDto } from '../dto/perform-place-transition.dto';
import { PlacesStateMachine } from '../services/state-machine/places.state-machine';
import { PlaceScope } from '../types/placeScope';
import { JournalsService } from '../../journals/services/journals.service';
import { Action } from '../../journals/types/action.enum';
import { PlaceState } from '../types/place.state.enum';
import { UsersDraftsService } from '../../users-drafts/services/users-drafts.service';
import { CreateDraftPlaceDto } from '../dto/create-draft-place.dto';

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
    private readonly placeStateMachine: PlacesStateMachine,
    private readonly journalsService: JournalsService,
    private readonly usersDraftsService: UsersDraftsService,
  ) {}

  @ApiQuery({ name: 'supply', type: String })
  @ApiResponse({
    isArray: true,
    type: Place,
    description:
      'if query param "supplyId" is given - returns all active places with demands for specific supply; if not - returns all active places',
  })
  @Get('/')
  public async getActivePlaces(@Query('supplyId') supplyId?: string): Promise<Place[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      if (supplyId) {
        const supplies = supplyId.split(',');
        return await this.placesService.getPlacesWithSupplies(transaction, supplies, PlaceScope.ACTIVE);
      }

      return await this.placesService.getDetailedPlaces(transaction, PlaceScope.ACTIVE);
    });
  }

  @ApiQuery({ name: 'state', type: Number })
  @ApiResponse({
    isArray: true,
    type: Place,
    description: 'returns all places',
  })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Get('/all')
  public async getAllPlaces(@Query('state') state?: string): Promise<Place[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const placeState = state ? +state : undefined;
      const scope = this.placesService.mapStateToScope(placeState);
      return await this.placesService.getDetailedPlaces(transaction, scope);
    });
  }

  @ApiResponse({ isArray: true, type: Place, description: 'returns single place by id or slug' })
  @Get('/:idOrSlug')
  public async getPlace(@Param('idOrSlug') idOrSlug: string): Promise<Place | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const place = await this.placesService.getPlaceByIdOrSlug(transaction, idOrSlug);

      if (!place) {
        throw new NotFoundError('PLACE_NOT_FOUND');
      }

      return place;
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

    this.journalsService.logInJournal({
      action: Action.DELETE_ALL_DEMANDS,
      user: user.login,
      details: `All demands removed from place ${placeId}`,
    });
  }

  @ApiResponse({ type: Place, description: 'creates place and returns created entity' })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createPlace(@SessionUser() user: User, @Body() placeDto: CreatePlaceDto): Promise<Place | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const place = await this.placesService.createPlace(transaction, placeDto, PlaceState.ACTIVE);

      if (!place) {
        throw new NotFoundError();
      }

      return place;
    });
  }

  @ApiResponse({
    type: Place,
    description: 'creates draft for place to be accepted by admin later and returns created entity',
  })
  @Post('/draft')
  public async createDraftPlace(@Body() placeDto: CreateDraftPlaceDto): Promise<Place | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const place = await this.placesService.createPlace(transaction, placeDto, PlaceState.INACTIVE);

      if (!place) {
        throw new NotFoundError();
      }

      await this.usersDraftsService.createUserDraft(transaction, { email: placeDto.userEmail, placeId: place.id });

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
    const place = await this.sequelize.transaction(async (transaction): Promise<Place> => {
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

    this.journalsService.logInJournal({
      action: Action.EDIT_PLACE,
      user: user.login,
      details: `Place ${placeId} updated by user with role ${user.role}`,
    });

    return place;
  }

  @ApiResponse({ type: Place, description: 'performs state transition on place and returns updated entity' })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Patch('/:id/transitions/perform')
  public async performTransition(
    @Param('id') placeId: string,
    @Body() performTransitionDto: PerformPlaceTransitionDto,
  ): Promise<Place | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const place = await this.placeStateMachine.performTransition(
        placeId,
        performTransitionDto.transition,
        transaction,
      );
      if (!place) {
        throw new CRUDError('CANNOT_PERFORM_PLACE_ACTION');
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
