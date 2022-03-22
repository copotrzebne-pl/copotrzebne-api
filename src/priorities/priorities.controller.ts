import { Controller, Get, Injectable, UseFilters } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Priority } from './models/priorities.model';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PrioritiesService } from './services/priorities.service';
import { ErrorHandler } from '../error/error-handler';

@ApiTags('priorities')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('priorities')
export class PrioritiesController {
  constructor(private readonly sequelize: Sequelize, private readonly prioritiesService: PrioritiesService) {}

  @ApiResponse({ isArray: true, type: Priority, description: 'returns all priorities' })
  @Get('/')
  public async getPriorities(): Promise<Priority[] | void> {
    return await this.sequelize.transaction(async (transaction): Promise<Priority[]> => {
      return await this.prioritiesService.getAllPriorities(transaction);
    });
  }
}
