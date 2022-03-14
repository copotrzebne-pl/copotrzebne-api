import { Controller, Get, Injectable, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { PlacesService } from './services/places.service';
import { Place } from './models/places.model';
import { AuthGuard } from '../guards/authentication.guard';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';

@Controller('places')
@Injectable()
export class PlacesController {
  constructor(private readonly sequelize: Sequelize, private readonly placesService: PlacesService) {}

  @Get('/')
  public async getPlaces(): Promise<Place[]> {
    return await this.sequelize.transaction(async (transaction): Promise<Place[]> => {
      return await this.placesService.getAllPlaces(transaction);
    });
  }

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createPlace() {
    // TODO: add implementation
    return null;
  }
}
