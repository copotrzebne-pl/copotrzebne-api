import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Supply } from '../models/supplies.model';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectModel(Supply)
    private readonly supplyModel: typeof Supply,
  ) {}

  public async getAllSupplies(transaction: Transaction): Promise<Supply[]> {
    return await this.supplyModel.findAll({ transaction });
  }
}
