import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Place } from './models/place.model';
import { Transaction } from 'sequelize';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
  ) {}

  public async getAllPlaces(transaction: Transaction): Promise<Place[]> {
    try {
      return await this.placeModel.findAll({ transaction });
    } catch (error) {
      // TODO: return handled error gracefully
      throw error;
    }
  }
}
