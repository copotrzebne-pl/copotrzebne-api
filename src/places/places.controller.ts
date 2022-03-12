import { Controller, Get, Injectable, Post } from '@nestjs/common';

import { PlacesService } from './places.service';
import { Place } from './places.model';
import { Sequelize } from 'sequelize-typescript';

@Controller('places')
@Injectable()
export class PlacesController {
  constructor(private readonly sequelize: Sequelize, private readonly placesService: PlacesService) {}

  @Get('/')
  public async getPlaces(): Promise<Place[]> {
    const places = await this.sequelize.transaction(async (transaction) => {
      return await this.placesService.getAllPlaces(transaction);
    });

    return places;
  }

  // @Post('/')
  // public async createPlace() {
  //
  // }
}
