import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Place } from '../models/places.model';
import { Transaction } from 'sequelize';
import { CreatePlaceDto } from '../dto/createPlaceDto';
import { UpdatePlaceDto } from '../dto/updatePlaceDto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
  ) {}

  public async getAllPlaces(transaction: Transaction): Promise<Place[]> {
    return await this.placeModel.findAll({ transaction });
  }

  public async createPlace(transaction: Transaction, placeDto: CreatePlaceDto): Promise<Place> {
    return await this.placeModel.create({ ...placeDto }, { transaction });
  }

  public async updatePlace(transaction: Transaction, id: string, placeDto: UpdatePlaceDto): Promise<Place | null> {
    await this.placeModel.update({ ...placeDto }, { where: { id }, transaction });
    return this.placeModel.findByPk(id, { transaction });
  }
}
