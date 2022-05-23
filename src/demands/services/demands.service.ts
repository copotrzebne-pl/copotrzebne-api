import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Order, Transaction } from 'sequelize';
import { Demand } from '../models/demand.model';
import { Supply } from '../../supplies/models/supply.model';
import { Priority } from '../../priorities/models/priority.model';
import { CreateDemandDto } from '../dto/create-demand.dto';
import { UpdateDemandDto } from '../dto/update-demand.dto';
import { Category } from '../../categories/models/category.model';
import { DemandSortOptions } from '../types/demands-sort-options.type.enum';
import IncorrectValueError from '../../error/incorrect-value.error';
import { PlacesService } from '../../places/services/places.service';
import NotFoundError from '../../error/not-found.error';

@Injectable()
export class DemandsService {
  constructor(
    @InjectModel(Demand)
    private readonly demandModel: typeof Demand,
    private readonly placesService: PlacesService,
  ) {}

  public async getDemandById(transaction: Transaction, id: string): Promise<Demand | null> {
    return await this.demandModel.findByPk(id, { transaction });
  }

  public async getDemandsForPlace(transaction: Transaction, placeId: string): Promise<Demand[]> {
    return await this.demandModel.findAll({ where: { placeId }, transaction });
  }

  public async getDetailedDemandsForPlace(
    transaction: Transaction,
    placeId: string,
    sort: DemandSortOptions = DemandSortOptions.PL,
  ): Promise<Demand[]> {
    if (!Object.values(DemandSortOptions).includes(sort)) {
      throw new IncorrectValueError();
    }

    const order: Order =
      sort === DemandSortOptions.NEWEST
        ? [['createdAt', 'DESC']]
        : [
            [{ model: Supply, as: 'supply' }, { model: Category, as: 'category' }, `priority`, 'ASC'],
            [{ model: Supply, as: 'supply' }, sequelize.literal(`"name"#>>'{pl}'`), 'ASC'],
          ];

    return await this.demandModel.findAll({
      include: [{ model: Supply, include: [{ model: Category }] }, { model: Priority }],
      where: { placeId },
      order,
      transaction,
    });
  }

  public async getDetailedDemand(transaction: Transaction, id: string): Promise<Demand | null> {
    return await this.demandModel.findByPk(id, {
      include: [
        {
          model: Priority,
        },
        {
          model: Supply,
          include: [Category],
        },
      ],
      transaction,
    });
  }

  public async createDemand(transaction: Transaction, demandDto: CreateDemandDto): Promise<Demand | null> {
    const demand = await this.demandModel.create({ ...demandDto }, { transaction });
    const detailedDemand = await this.getDetailedDemand(transaction, demand.id);

    if (!detailedDemand) {
      return null;
    }

    await this.placesService.updatePlace(transaction, detailedDemand?.placeId, {
      lastUpdatedAt: detailedDemand.updatedAt,
    });

    return detailedDemand;
  }

  public async updateDemand(transaction: Transaction, id: string, demandDto: UpdateDemandDto): Promise<Demand | null> {
    await this.demandModel.update({ ...demandDto }, { where: { id }, transaction });
    const detailedDemand = await this.getDetailedDemand(transaction, id);

    if (!detailedDemand) {
      return null;
    }

    await this.placesService.updatePlace(transaction, detailedDemand?.placeId, {
      lastUpdatedAt: detailedDemand.updatedAt,
    });

    return detailedDemand;
  }

  public async deleteDemand(transaction: Transaction, id: string): Promise<void> {
    const demand = await this.getDemandById(transaction, id);

    if (!demand) {
      throw new NotFoundError('DEMAND_NOT_FOUND');
    }

    const placeId = demand.placeId;

    await demand.destroy({ transaction });

    const demandsForPlace = await this.getDemandsForPlace(transaction, placeId);

    if (!demandsForPlace || !demandsForPlace.length) {
      await this.placesService.updatePlace(transaction, placeId, {
        lastUpdatedAt: null,
      });
    }
  }

  public async deleteAllDemandsForPlace(transaction: Transaction, placeId: string): Promise<void> {
    const demands = await this.getDemandsForPlace(transaction, placeId);

    if (!demands || !demands.length) {
      return;
    }

    const demandsIds = demands.map((demand) => demand.id);

    await this.demandModel.destroy({ where: { id: demandsIds }, transaction });

    await this.placesService.updatePlace(transaction, placeId, {
      lastUpdatedAt: null,
    });
  }
}
