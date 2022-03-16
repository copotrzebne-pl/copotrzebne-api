import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Supply } from '../models/supplies.model';
import { CreateSupplyDto } from '../dto/createSupplyDto';
import { UpdateSupplyDto } from '../dto/updateSupplyDto';
import NotFoundError from '../../error/NotFoundError';

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

  public async updateSupply(transaction: Transaction, id: string, supplyDto: UpdateSupplyDto): Promise<Supply | null> {
    await this.supplyModel.update({ ...supplyDto }, { where: { id }, transaction });
    return this.supplyModel.findByPk(id, { transaction });
  }

  public async deleteSupply(transaction: Transaction, id: string): Promise<void> {
    const supply = await this.supplyModel.findByPk(id, { transaction });

    if (!supply) {
      throw new NotFoundError(`Supply ${id} not found`);
    }

    await supply.destroy();
  }
}
