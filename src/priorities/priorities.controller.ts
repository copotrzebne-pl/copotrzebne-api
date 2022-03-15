import { Controller, Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Priority } from './models/priorities.model';
import { ApiTags } from '@nestjs/swagger';

import { PrioritiesService } from './services/priorities.service';

@ApiTags('priorities')
@Controller('priorities')
@Injectable()
export class PrioritiesController {
  constructor(private readonly sequelize: Sequelize, private readonly prioritiesService: PrioritiesService) {}

  @Get('/')
  public async getSupplies(): Promise<Priority[]> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Priority[]> => {
        return await this.prioritiesService.getAllPriorities(transaction);
      });
    } catch (error) {
      throw new HttpException('Cannot get priorities', HttpStatus.BAD_REQUEST);
    }
  }
}
