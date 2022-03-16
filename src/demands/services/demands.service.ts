import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Demand } from '../models/demands.model';
import { Supply } from '../../supplies/models/supplies.model';
import { Priority } from '../../priorities/models/priorities.model';
import { CreateDemandDto } from '../dto/createDemandDto';
import { UpdateDemandDto } from '../dto/updateDemandDto';

@Injectable()
export class DemandsService {
  constructor(
    @InjectModel(Demand)
    private readonly demandModel: typeof Demand,
  ) {}

  public async getDemandsForPlace(transaction: Transaction, placeId: string): Promise<Demand[]> {
    return await this.demandModel.findAll({ where: { placeId }, transaction });
  }

  public async getDetailedDemandsForPlace(transaction: Transaction, placeId: string): Promise<Demand[]> {
    return await this.demandModel.findAll({ include: [Supply, Priority], where: { placeId }, transaction });
  }

  public async createDemand(transaction: Transaction, demandDto: CreateDemandDto): Promise<Demand> {
    return await this.demandModel.create({ ...demandDto }, { transaction });
  }

  public async updateDemand(transaction: Transaction, id: string, demandDto: UpdateDemandDto): Promise<Demand | null> {
    await this.demandModel.update({ ...demandDto }, { where: { id }, transaction });
    return this.demandModel.findByPk(id, { transaction });
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
