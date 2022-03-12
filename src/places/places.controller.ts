import {Controller, Get, Post} from '@nestjs/common';

import { PlacesService } from './places.service';
import { Place } from './models/place.model';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('/')
  public async getPlaces(): Promise<Place[]> {
    return await this.placesService.getAllPlaces();
  }

  // @Post('/')
  // public async createPlace() {
  //
  // }
}
