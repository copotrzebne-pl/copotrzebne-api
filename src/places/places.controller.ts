import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PlacesService } from './services/places.service';
import { Place } from './models/places.model';
import { AuthGuard } from '../guards/authentication.guard';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { Demand } from '../demands/models/demands.model';
import { DemandsService } from '../demands/services/demands.service';
import CRUDError from '../error/CRUDError';
import { CreatePlaceDto } from './dto/createPlaceDto';
import { UpdatePlaceDto } from './dto/updatePlaceDto';
import { SessionUserId } from '../decorators/session-user-id.decorator';
import { UsersService } from '../users/users.service';
import { errorHandler } from '../error/error-mapper';
import { AuthorizationError } from '../error/authorization.error';
import NotFoundError from '../error/not-found.error';

@ApiTags('places')
@Controller('places')
@Injectable()
export class PlacesController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly placesService: PlacesService,
    private readonly demandsService: DemandsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiResponse({ isArray: true, type: Place, description: 'returns all places' })
  @Get('/')
  public async getPlaces(): Promise<Place[]> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Place[]> => {
        return await this.placesService.getAllPlaces(transaction);
      });
    } catch (error) {
      throw new HttpException('CANNOT_GET_PLACES', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiHeader({ name: 'authorization' })
  @ApiResponse({ isArray: true, type: Place, description: 'returns places, which can be managed by the current user' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Get('/owned')
  public async getOwnedPlaces(@SessionUserId() userId: string) {
    try {
      const places = await this.sequelize.transaction(async (transaction): Promise<Place[] | void> => {
        const user = await this.usersService.getUserById(transaction, userId);

        if (!user) {
          throw new AuthorizationError();
        }

        if (user.role === UserRole.ADMIN) {
          return await this.placesService.getAllPlaces(transaction);
        }

        return await this.placesService.getUserPlaces(transaction, userId);
      });

      return places;
    } catch (error) {
      errorHandler(error);
    }
  }

  @ApiResponse({ isArray: true, type: Demand, description: 'returns all demands for place' })
  @Get(':id/demands')
  public async getDemandsForPlace(@Param('id') id: string): Promise<Demand[]> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Demand[]> => {
        return await this.demandsService.getDetailedDemandsForPlace(transaction, id);
      });
    } catch (error) {
      throw new HttpException('CANNOT_GET_DEMANDS', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({ status: 204, description: 'deletes all demands for place' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/demands')
  public async deleteDemandsForPlace(@Param('id') id: string): Promise<void> {
    try {
      await this.sequelize.transaction(async (transaction): Promise<void> => {
        await this.demandsService.deleteAllDemandsForPlace(transaction, id);
      });
    } catch (error) {
      throw new HttpException('CANNOT_DELETE_DEMANDS', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({ type: Place, description: 'creates place and returns created entity' })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createPlace(@SessionUserId() userId: string, @Body() placeDto: CreatePlaceDto): Promise<Place | void> {
    try {
      const place = await this.sequelize.transaction(async (transaction) => {
        const user = await this.usersService.getUserById(transaction, userId);
        if (!user || user.role !== UserRole.ADMIN) {
          throw new AuthorizationError();
        }

        return await this.placesService.createPlace(transaction, placeDto);
      });

      if (!place) {
        throw new NotFoundError();
      }

      return place;
    } catch (error) {
      errorHandler(error);
    }
  }

  @ApiResponse({ type: Place, description: 'updates place and returns updated entity' })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updatePlace(
    @SessionUserId() userId: string,
    @Param('id') id: string,
    @Body() placeDto: UpdatePlaceDto,
  ): Promise<Place | void> {
    try {
      const place = await this.sequelize.transaction(async (transaction) => {
        const user = await this.usersService.getUserById(transaction, userId);

        if (!user) {
          throw new AuthorizationError();
        }

        if (user.role !== UserRole.ADMIN) {
          const userPlaces = await this.placesService.getUserPlaces(transaction, userId);
          const userPlacesIds = userPlaces.map((place) => place.id);

          if (!userPlacesIds.includes(id)) {
            throw new AuthorizationError();
          }
        }

        return await this.placesService.updatePlace(transaction, id, placeDto);
      });

      if (!place) {
        throw new CRUDError('CANNOT_UPDATE_PLACE');
      }

      return place;
    } catch (error) {
      errorHandler(error);
    }
  }
}
