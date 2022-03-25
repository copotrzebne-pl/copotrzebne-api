import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Priority } from '../models/priority.model';

@Injectable()
export class PrioritiesService {
  constructor(
    @InjectModel(Priority)
    private readonly priorityModel: typeof Priority,
  ) {}

  public async getAllPriorities(transaction: Transaction): Promise<Priority[]> {
    return await this.priorityModel.findAll({ transaction });
  }
}
