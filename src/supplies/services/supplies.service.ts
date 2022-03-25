import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Supply } from '../models/supply.model';
import { CreateSupplyDto } from '../dto/create-supply.dto';
import { UpdateSupplyDto } from '../dto/update-supply.dto';
import NotFoundError from '../../error/not-found.error';
import { Category } from '../../categories/models/category.model';
import { Language } from '../../types/language.type.enum';
import IncorrectValueError from '../../error/incorrect-value.error';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectModel(Supply)
    private readonly supplyModel: typeof Supply,
  ) {}

  public async getSupplyById(transaction: Transaction, id: string): Promise<Supply | null> {
    return await this.supplyModel.findByPk(id, { transaction });
  }

  public async getDetailedSupplies(transaction: Transaction, sort: Language = Language.PL): Promise<Supply[]> {
    if (!Object.values(Language).includes(sort)) {
      throw new IncorrectValueError();
    }

    return await this.supplyModel.findAll({
      include: [{ model: Category }],
      order: [
        [{ model: Category, as: 'category' }, `priority`, 'ASC'],
        [`name_${sort}`, 'ASC'],
      ],
      transaction,
    });
  }

  public async createSupply(transaction: Transaction, supplyDto: CreateSupplyDto): Promise<Supply> {
    return await this.supplyModel.create({ ...supplyDto }, { transaction });
  }

  public async updateSupply(transaction: Transaction, id: string, supplyDto: UpdateSupplyDto): Promise<Supply | null> {
    await this.supplyModel.update({ ...supplyDto }, { where: { id }, transaction });
    return await this.getSupplyById(transaction, id);
  }

  public async deleteSupply(transaction: Transaction, id: string): Promise<void> {
    const supply = await this.supplyModel.findByPk(id, { transaction });

    if (!supply) {
      throw new NotFoundError(`SUPPLY_NOT_FOUND`);
    }

    await supply.destroy({ transaction });
  }
}
