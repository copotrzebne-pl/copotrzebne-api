import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, WhereOptions } from 'sequelize';

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
import { PlaceScope } from '../types/place-scope.enum';
import { PlaceState } from '../types/place.state.enum';
import { Sequelize } from 'sequelize-typescript';
import { TranslatedField } from '../../types/translated.field.type';
import { PlaceLink } from '../../place-links/models/place-link.model';
import { PlaceLinkDto } from '../../place-links/dto/place-link.dto';
import { PlaceBoundaries } from '../types/place-boundaries.type';
import IncorrectValueError from '../../error/incorrect-value.error';
import { PublicAnnouncement } from '../../announcements/models/public-announcement.model';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place)
    private readonly placeModel: typeof Place,
    @InjectModel(PlaceLink)
    private readonly placeLinkModel: typeof PlaceLink,
    private readonly usersService: UsersService,
    private readonly sequelize: Sequelize,
  ) {}

  public async getPlaceById(transaction: Transaction, id: string): Promise<Place | null> {
    const place = await this.placeModel.findByPk(id, {
      include: [{ model: Demand, include: [Priority] }],
      transaction,
    });

    return place ? this.getRawPlaceWithoutAssociations(place) : null;
  }

  public async getDetailedPlaceByIdOrSlug(transaction: Transaction, idOrSlug: string): Promise<Place | null> {
    return await this.placeModel.findOne({
      where: {
        [Op.or]: [
          this.sequelize.where(this.sequelize.cast(this.sequelize.col('id'), 'varchar'), { [Op.eq]: idOrSlug }),
          {
            nameSlug: {
              [Op.or]: [{ pl: idOrSlug }, { en: idOrSlug }, { ua: idOrSlug }],
            },
          },
        ],
      },
      include: [{ model: Demand, include: [{ model: Supply, include: [Category] }, Priority] }, PublicAnnouncement],
      transaction,
    });
  }

  public async getDetailedPlaces(
    transaction: Transaction,
    scope: PlaceScope = PlaceScope.DEFAULT,
    boundaries?: string,
  ): Promise<Place[]> {
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
      where: {
        ...this.createWhereClauseForBoundaries(boundaries),
      },
      transaction,
    });

    return this.sortPlacesByLastUpdateAndPriority(places);
  }

  public async getPlacesWithSupplies(
    transaction: Transaction,
    suppliesIds: string[],
    scope: PlaceScope = PlaceScope.DEFAULT,
    boundaries?: string,
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
        ...this.createWhereClauseForBoundaries(boundaries),
      },
      transaction,
    });

    return this.sortPlacesByLastUpdateAndPriority(places);
  }

  public async createPlace(
    transaction: Transaction,
    placeDto: CreatePlaceDto,
    state: PlaceState,
  ): Promise<Place | null> {
    const nameSlug: TranslatedField = {
      pl: slugify(placeDto.name.pl),
      en: slugify(placeDto.name.en),
      ua: slugify(placeDto.name.ua),
    };

    const place = await this.placeModel.create({ ...placeDto, nameSlug, state }, { transaction });

    if (placeDto.placeLink) {
      await this.createLinkForPlace(transaction, place.id, placeDto.placeLink);
    }

    return this.getPlaceById(transaction, place.id);
  }

  public async updatePlace(transaction: Transaction, id: string, placeDto: UpdatePlaceDto): Promise<Place | null> {
    const place = await this.placeModel.findByPk(id, { include: [Demand], transaction });

    if (!place) {
      throw new NotFoundError();
    }

    const nameSlug: TranslatedField = placeDto.name
      ? {
          pl: slugify(placeDto.name.pl),
          en: slugify(placeDto.name.en),
          ua: slugify(placeDto.name.ua),
        }
      : {
          pl: slugify(place.name.pl),
          en: slugify(place.name.en),
          ua: slugify(place.name.ua),
        };

    const lastUpdatedAt = place.demands.length ? placeDto.lastUpdatedAt : null;

    await this.placeModel.update({ ...placeDto, nameSlug, lastUpdatedAt }, { where: { id }, transaction });

    if (placeDto.placeLink) {
      const linkForPlace = await this.getLinkForPlace(transaction, id);

      if (linkForPlace) {
        await this.updateLinkForPlace(transaction, id, placeDto.placeLink);
      } else {
        await this.createLinkForPlace(transaction, id, placeDto.placeLink);
      }
    }

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

  public async getLinkForPlace(transaction: Transaction, placeId: string): Promise<PlaceLink | null> {
    return await this.placeLinkModel.findOne({ where: { placeId }, transaction });
  }

  public async createLinkForPlace(
    transaction: Transaction,
    placeId: string,
    placeLinkDto: PlaceLinkDto,
  ): Promise<PlaceLink> {
    return await this.placeLinkModel.create({ ...placeLinkDto, placeId }, { transaction });
  }

  public async updateLinkForPlace(
    transaction: Transaction,
    placeId: string,
    placeLinkDto: PlaceLinkDto,
  ): Promise<PlaceLink | null> {
    await this.placeLinkModel.update({ ...placeLinkDto }, { where: { placeId }, transaction });
    return await this.getLinkForPlace(transaction, placeId);
  }

  public mapStateToScope(state: PlaceState | undefined): PlaceScope {
    if (!state || !Object.values(PlaceState).includes(state)) {
      return PlaceScope.DEFAULT;
    }

    return state === PlaceState.ACTIVE ? PlaceScope.ACTIVE : PlaceScope.INACTIVE;
  }

  private getRawPlaceWithoutAssociations(place: Place): Place {
    const { demands = [], users = [], ...rawPlace } = place.get();
    return rawPlace as Place;
  }

  private sortPlacesByLastUpdateAndPriority(places: Place[]): Place[] {
    return places.sort(this.sortPlacesByPriority).sort(this.sortPlacesByLastUpdate);
  }

  private sortPlacesByPriority(place1: Place, place2: Place): number {
    return place2.priority - place1.priority;
  }

  private sortPlacesByLastUpdate(place1: Place, place2: Place): number {
    const place1LastUpdatedAt = place1.lastUpdatedAt ? place1.lastUpdatedAt.getTime() : 0;
    const place2LastUpdatedAt = place2.lastUpdatedAt ? place2.lastUpdatedAt.getTime() : 0;

    return place2LastUpdatedAt - place1LastUpdatedAt;
  }

  createWhereClauseForBoundaries(boundariesStr?: string): WhereOptions<Place> {
    if (!boundariesStr) {
      return {};
    }

    const boundaries = this.createPlaceBoundariesFromString(boundariesStr);

    return {
      latitude: { [Op.lte]: boundaries.topLeft.lat, [Op.gte]: boundaries.bottomRight.lat },
      longitude: { [Op.lte]: boundaries.bottomRight.long, [Op.gte]: boundaries.topLeft.long },
    };
  }

  private createPlaceBoundariesFromString(boundaries: string): PlaceBoundaries {
    const coordinates = boundaries.split(',').map((boundary) => parseFloat(boundary));

    if (coordinates.some((coordinate) => isNaN(coordinate))) {
      throw new IncorrectValueError();
    }

    const [north, west, south, east] = coordinates;

    return {
      topLeft: { lat: north, long: west },
      bottomRight: { lat: south, long: east },
    };
  }
}
