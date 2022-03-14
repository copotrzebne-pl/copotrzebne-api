import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { PlacesService } from './services/places.service';
import { Place } from './models/places.model';
import { AuthGuard } from '../guards/authentication.guard';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { Demand } from '../demands/models/demands.model';
import { DemandsService } from '../demands/services/demands.service';

@Controller('places')
@Injectable()
export class PlacesController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly placesService: PlacesService,
    private readonly demandsService: DemandsService,
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
  public async createPlace() {
    // TODO: add implementation
    return null;
  }
}
