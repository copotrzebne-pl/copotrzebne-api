import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Demand } from '../models/demands.model';
import { Supply } from '../../supplies/models/supplies.model';
import { Priority } from '../../priorities/models/priorities.model';
import { CreateDemandDto } from '../dto/createDemandDto';
import { UpdateDemandDto } from '../dto/updateDemandDto';
import { Category } from '../../categories/models/categories.model';
import { Language } from '../../types/language.type.enum';
import IncorrectValueError from '../../error/incorrectValue.error';

@Injectable()
export class DemandsService {
  constructor(
    @InjectModel(Demand)
    private readonly demandModel: typeof Demand,
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
    sort: Language = Language.PL,
  ): Promise<Demand[]> {
    if (!Object.values(Language).includes(sort)) {
      throw new IncorrectValueError();
    }

    return await this.demandModel.findAll({
      include: [{ model: Supply, include: [{ model: Category }] }, { model: Priority }],
      where: { placeId },
      order: [
        [{ model: Supply, as: 'supply' }, { model: Category, as: 'category' }, `name_${sort}`, 'ASC'],
        [{ model: Supply, as: 'supply' }, `name_${sort}`, 'ASC'],
      ],
      transaction,
    });
  }

  public async createDemand(transaction: Transaction, demandDto: CreateDemandDto): Promise<Demand> {
    return await this.demandModel.create({ ...demandDto }, { transaction });
  }

  public async updateDemand(transaction: Transaction, id: string, demandDto: UpdateDemandDto): Promise<Demand | null> {
    await this.demandModel.update({ ...demandDto }, { where: { id }, transaction });
    return await this.getDemandById(transaction, id);
  }

  public async deleteDemand(transaction: Transaction, id: string): Promise<void> {
    await Demand.destroy({ where: { id } });
  }

  public async deleteAllDemandsForPlace(transaction: Transaction, placeId: string): Promise<void> {
    const demands = await this.getDemandsForPlace(transaction, placeId);

    if (!demands || !demands.length) {
      return;
    }

    const demandsIds = demands.map((demand) => demand.id);

    await Demand.destroy({ where: { id: demandsIds } });
  }
}
