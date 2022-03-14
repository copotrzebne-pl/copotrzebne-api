import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Demand } from '../models/demands.model';
import { Supply } from '../../supplies/models/supplies.model';
import { Priority } from '../../priorities/models/priorities.model';

@Injectable()
export class DemandsService {
  constructor(
    @InjectModel(Demand)
    private readonly demandModel: typeof Demand,
  ) {}

  public async getDetailedDemandsForPlace(transaction: Transaction, placeId: string): Promise<Demand[]> {
    return await this.demandModel.findAll({ include: [Supply, Priority], where: { placeId }, transaction });
  }
}
