import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Category } from '../models/categories.model';
import { Language } from '../../types/language.type.enum';
import IncorrectValueError from '../../error/incorrect-value.error';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  public async getAllCategories(transaction: Transaction, sort: Language = Language.PL): Promise<Category[]> {
    if (!Object.values(Language).includes(sort)) {
      throw new IncorrectValueError();
    }

    return await this.categoryModel.findAll({ order: [[`name_${sort}`, 'ASC']], transaction });
  }
}
