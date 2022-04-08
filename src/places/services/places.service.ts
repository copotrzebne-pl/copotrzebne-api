import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { Place } from '../models/place.model';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';
import { UsersService } from '../../users/users.service';
import CRUDError from '../../error/crud.error';
import { Demand } from '../../demands/models/demand.model';
import { User } from '../../users/models/user.model';
import { UserRole } from '../../users/types/user-role.enum';
import { Supply } from '../../supplies/models/supply.model';
import { slugify } from '../../helpers/slugifier';
import NotFoundError from '../../error/not-found.error';
import { Priority } from '../../priorities/models/priority.model';
import { Category } from '../../categories/models/category.model';
import { PlaceScope } from '../types/place.scope';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
    private readonly usersService: UsersService,
  ) {}

  public async getPlaceById(transaction: Transaction, id: string): Promise<Place | null> {
    const place = await this.placeModel.findByPk(id, {
      include: [{ model: Demand, include: [Priority] }],
      transaction,
    });
    return place ? this.getRawPlaceWithoutAssociations(place) : null;
  }

  public async getDetailedPlaces(transaction: Transaction, scope: PlaceScope = ''): Promise<Place[]> {
    const places = await this.placeModel.scope(scope).findAll({
      include: [
        {
          model: Demand,
          include: [
            {
              model: Supply,
              include: [Category],
            },
            {
              model: Priority,
            },
          ],
        },
      ],
      transaction,
    });

    return places.sort(this.sortPlacesByLastUpdate);
  }

  public async getPlacesWithSupplies(
    transaction: Transaction,
    suppliesIds: string[],
    scope: PlaceScope = '',
  ): Promise<Place[]> {
    const places = await this.placeModel.scope(scope).findAll({
      include: [
        {
          model: Demand,
          include: [Supply, Priority],
        },
      ],
      where: {
        '$demands->supply.id$': suppliesIds,
      },
    });

    return places.sort(this.sortPlacesByLastUpdate);
  }

  public async createPlace(transaction: Transaction, placeDto: CreatePlaceDto): Promise<Place> {
    const nameSlug = slugify(placeDto.name);
    return await this.placeModel.create({ nameSlug, ...placeDto }, { transaction });
  }

  public async updatePlace(transaction: Transaction, id: string, placeDto: UpdatePlaceDto): Promise<Place | null> {
    const place = await this.getPlaceById(transaction, id);

    if (!place) {
      throw new NotFoundError();
    }

    const nameSlug = placeDto.name ? slugify(placeDto.name) : slugify(place.name);

    await this.placeModel.update({ nameSlug, ...placeDto }, { where: { id }, transaction });

    return await this.getPlaceById(transaction, id);
  }

  public async deletePlace(transaction: Transaction, id: string): Promise<void> {
    await this.placeModel.destroy({ where: { id }, transaction });
  }

  public async getUserPlaces(transaction: Transaction, userId: string): Promise<Place[]> {
    const user = await this.usersService.getUserById(transaction, userId);

    if (!user) {
      throw new CRUDError();
    }

    const places = await this.placeModel.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          through: { attributes: [] },
        },
        {
          model: Demand,
          include: [Priority],
        },
      ],
      transaction,
    });

    return places.map((place) => {
      return this.getRawPlaceWithoutAssociations(place);
    });
  }

  public async isPlaceManageableByUser(transaction: Transaction, user: User, placeId: string): Promise<boolean> {
    if (user.role !== UserRole.ADMIN) {
      const userPlaces = await user.$get('places', { transaction });
      const placesIds = userPlaces ? userPlaces.map((place) => place.id) : [];

      return placesIds.includes(placeId);
    }

    return true;
  }

  private getRawPlaceWithoutAssociations(place: Place): Place {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { demands = [], users = [], ...rawPlace } = place.get();
    return rawPlace as Place;
  }

  private sortPlacesByLastUpdate(place1: Place, place2: Place): number {
    const place1LastUpdatedAt = place1.lastUpdatedAt ? place1.lastUpdatedAt.getTime() : 0;
    const place2LastUpdatedAt = place2.lastUpdatedAt ? place2.lastUpdatedAt.getTime() : 0;

    return place2LastUpdatedAt - place1LastUpdatedAt;
  }
}
