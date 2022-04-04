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
import { OpeningHoursService } from '../../opening-hours/services/opening-hours.service';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
    private readonly usersService: UsersService,
    private readonly openingHoursService: OpeningHoursService,
  ) {}

  public async getPlaceById(transaction: Transaction, id: string): Promise<Place | null> {
    const place = await this.placeModel.findByPk(id, { include: [Demand], transaction });
    return place ? this.getRawPlaceWithoutAssociations(place) : null;
  }

  public async getAllPlaces(transaction: Transaction): Promise<Place[]> {
    const places = await this.placeModel.findAll({ include: [Demand], transaction });
    return places.map((place) => this.getRawPlaceWithoutAssociations(place)).sort(this.sortPlacesByLastUpdate);
  }

  public async getPlacesWithSupplies(transaction: Transaction, suppliesIds: string[]): Promise<Place[]> {
    const places = await this.placeModel.findAll({
      include: [
        {
          model: Demand,
          include: [Supply],
        },
      ],
      where: {
        '$demands->supply.id$': suppliesIds,
      },
    });

    return places.sort(this.sortPlacesByLastUpdate);
  }

  public async createPlace(transaction: Transaction, placeDto: CreatePlaceDto): Promise<Place | null> {
    const nameSlug = slugify(placeDto.name);

    const place = await this.placeModel.create({ nameSlug, ...placeDto }, { transaction });

    await this.openingHoursService.createOpeningHoursForPlace(transaction, place.id, placeDto.openingHours);

    return this.placeModel.findByPk(place.id, { transaction });
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
