import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Post,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ErrorHandler } from '../../error/error-handler';
import { Sequelize } from 'sequelize-typescript';
import { PlacesService } from '../services/places.service';
import { DemandsService } from '../../demands/services/demands.service';
import { UsersService } from '../../users/users.service';
import { Place } from '../models/place.model';
import { MetadataKey } from '../../types/metadata-key.enum';
import { UserRole } from '../../users/types/user-role.enum';
import { AuthGuard } from '../../guards/authentication.guard';
import { SessionUser } from '../../decorators/session-user.decorator';
import { User } from '../../users/models/user.model';
import { Action } from '../../journals/types/action.enum';
import { JournalsService } from '../../journals/services/journals.service';

@ApiTags('users-places')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('users-places')
export class UsersPlacesController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly placesService: PlacesService,
    private readonly demandsService: DemandsService,
    private readonly usersService: UsersService,
    private readonly journalsService: JournalsService,
  ) {}

  @ApiHeader({ name: 'authorization' })
  @ApiResponse({ isArray: true, type: Place, description: 'returns places, which can be managed by the current user' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Get('/owned')
  public async getOwnedPlaces(@SessionUser() user: User): Promise<Place[] | void> {
    const userPlaces = await this.sequelize.transaction(async (transaction): Promise<Place[]> => {
      if (user.role === UserRole.ADMIN) {
        return await this.placesService.getDetailedPlaces(transaction);
      }

      return await this.placesService.getUserPlaces(transaction, user.id);
    });

    if (user.role === UserRole.PLACE_MANAGER) {
      this.journalsService.logInJournal({
        action: Action.GET_OWNED_PLACES,
        user: user.login,
        details: `Place manager fetched owned places`,
      });
    }

    return userPlaces;
  }

  @ApiResponse({ status: 204, description: 'Assign place to user. Only admin can assign places.' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/:userId/assign-place/:placeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async assignPlaceToUser(@Param('userId') userId: string, @Param('placeId') placeId: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      await this.usersService.assignPlaceToUser(transaction, placeId, userId);
    });
  }

  @ApiResponse({ status: 204, description: 'Removes place - user relation. Only admin can user it.' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Delete('/:userId/assign-place/:placeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removePlaceAssignmentFromUser(
    @Param('userId') userId: string,
    @Param('placeId') placeId: string,
  ): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      await this.usersService.removePlaceAssignmentFromUser(transaction, placeId, userId);
    });
  }
}
