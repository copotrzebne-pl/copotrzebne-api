import { Controller, Get, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Priority } from './models/priorities.model';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PrioritiesService } from './services/priorities.service';
import { errorHandler } from '../error/error-mapper';

@ApiTags('priorities')
@Controller('priorities')
@Injectable()
export class PrioritiesController {
  constructor(private readonly sequelize: Sequelize, private readonly prioritiesService: PrioritiesService) {}

  @ApiResponse({ isArray: true, type: Priority, description: 'returns all priorities' })
  @Get('/')
  public async getPriorities(): Promise<Priority[] | void> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Priority[]> => {
        return await this.prioritiesService.getAllPriorities(transaction);
      });
    } catch (error) {
      errorHandler(error);
    }
  }
}
