import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Category } from '../models/category.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  public async getAllCategories(transaction: Transaction): Promise<Category[]> {
    return await this.categoryModel.findAll({ order: [[`priority`, 'ASC']], transaction });
  }
}
