import {
  Body,
  Controller,
  Get,
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

  @Get('/')
  public async getPlaces(): Promise<Place[]> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Place[]> => {
        return await this.placesService.getAllPlaces(transaction);
      });
    } catch (error) {
      throw new HttpException('Cannot get places', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({ isArray: true, type: Place, description: 'returns places, which can be managed by the current user' })
  @ApiHeader({ name: 'authorization' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Get('/owned')
  public async getOwnedPlaces(@SessionUserId() userId: string | null) {
    try {
      if (!userId) {
        throw new CRUDError();
      }

      const places = await this.sequelize.transaction(async (transaction): Promise<Place[]> => {
        const user = await this.usersService.getUserById(transaction, userId);

        if (!user) {
          throw new CRUDError();
        }

        if (user.role === UserRole.ADMIN) {
          return await this.placesService.getAllPlaces(transaction);
        }

        return await this.placesService.getUserPlaces(transaction, userId);
      });

      return places;
    } catch (error) {
      throw new HttpException('ACCESS_FORBIDDEN', HttpStatus.FORBIDDEN);
    }
  }

  @Get(':id/demands')
  public async getDemandsForPlace(@Param('id') id: string): Promise<Demand[]> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Demand[]> => {
        return await this.demandsService.getDetailedDemandsForPlace(transaction, id);
      });
    } catch (error) {
      throw new HttpException('Cannot get demands for place', HttpStatus.BAD_REQUEST);
    }
  }

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createPlace(@Body() placeDto: CreatePlaceDto): Promise<Place> {
    try {
      const place = await this.sequelize.transaction(async (transaction) => {
        return await this.placesService.createPlace(transaction, placeDto);
      });

      if (!place) {
        throw new CRUDError();
      }

      return place;
    } catch (error) {
      throw new HttpException('Cannot create Place', HttpStatus.BAD_REQUEST);
    }
  }

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updatePlace(@Param('id') id: string, @Body() placeDto: UpdatePlaceDto): Promise<Place> {
    try {
      const place = await this.sequelize.transaction(async (transaction) => {
        return await this.placesService.updatePlace(transaction, id, placeDto);
      });

      if (!place) {
        throw new CRUDError();
      }

      return place;
    } catch (error) {
      throw new HttpException('Cannot create Place', HttpStatus.BAD_REQUEST);
    }
  }
}
