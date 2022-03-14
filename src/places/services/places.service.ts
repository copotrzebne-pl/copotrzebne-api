import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Place } from '../models/places.model';
import { Transaction } from 'sequelize';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
  ) {}

  public async getAllPlaces(transaction: Transaction): Promise<Place[]> {
    return await this.placeModel.findAll({ transaction });
  }
}
