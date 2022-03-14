import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Supply } from '../models/supplies.model';
import { CreateSupplyDto } from '../dto/createSupplyDto';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectModel(Supply)
    private readonly supplyModel: typeof Supply,
  ) {}

  public async getAllSupplies(transaction: Transaction): Promise<Supply[]> {
    return await this.supplyModel.findAll({ transaction });
  }

  public async createSupply(transaction: Transaction, supplyDto: CreateSupplyDto): Promise<Supply> {
    return this.supplyModel.create({ ...supplyDto }, { transaction });
  }
}
