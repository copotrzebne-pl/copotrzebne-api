import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Place } from './models/place.model';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
  ) {}

  public async getAllPlaces(): Promise<Place[]> {
    try {
      return await this.placeModel.findAll();
    } catch (error) {
      // TODO: return handled error gracefully
      throw error;
    }
  }
}
