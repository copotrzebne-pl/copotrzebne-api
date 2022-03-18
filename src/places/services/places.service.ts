import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { Place } from '../models/places.model';
import { CreatePlaceDto } from '../dto/createPlaceDto';
import { UpdatePlaceDto } from '../dto/updatePlaceDto';
import { UsersService } from '../../users/users.service';
import CRUDError from '../../error/CRUD.error';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
    private readonly usersService: UsersService,
  ) {}

  public async getPlaceById(transaction: Transaction, id: string): Promise<Place | null> {
    return await this.placeModel.findByPk(id, { transaction });
  }

  public async getAllPlaces(transaction: Transaction): Promise<Place[]> {
    return await this.placeModel.findAll({ transaction });
  }

  public async createPlace(transaction: Transaction, placeDto: CreatePlaceDto): Promise<Place> {
    return await this.placeModel.create({ ...placeDto }, { transaction });
  }

  public async updatePlace(transaction: Transaction, id: string, placeDto: UpdatePlaceDto): Promise<Place | null> {
    await this.placeModel.update({ ...placeDto }, { where: { id }, transaction });
    return await this.getPlaceById(transaction, id);
  }

  public async getUserPlaces(transaction: Transaction, userId: string): Promise<Place[]> {
    const user = await this.usersService.getUserById(transaction, userId);

    if (!user) {
      throw new CRUDError();
    }

    // TODO: skip "UserPlace" from output
    const places = await user.$get('places');
    return places;
  }
}
