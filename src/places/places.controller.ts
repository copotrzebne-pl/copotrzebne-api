import { Controller, Get, Injectable, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { PlacesService } from './places.service';
import { Sequelize } from 'sequelize-typescript';
import { Place } from './models/place.model';
import { AuthGuard } from '../guards/authentication.guard';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';

@Controller('places')
@Injectable()
export class PlacesController {
  constructor(private readonly sequelize: Sequelize, private readonly placesService: PlacesService) {}

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN, UserRole.SERVICE])
  @Get('/')
  public async getPlaces(): Promise<Place[]> {
    const places = await this.sequelize.transaction(async (transaction) => {
      return await this.placesService.getAllPlaces(transaction);
    });

    return places;
  }

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createPlace() {
    // TODO: add implementation
    return null;
  }
}
