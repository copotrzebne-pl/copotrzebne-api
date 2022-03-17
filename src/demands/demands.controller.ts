import { Body, Controller, Get, Injectable, Param, Patch, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { DemandsService } from './services/demands.service';
import { CreateDemandDto } from './dto/createDemandDto';
import { Demand } from './models/demands.model';
import CRUDError from '../error/CRUDError';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { AuthGuard } from '../guards/authentication.guard';
import { UpdateDemandDto } from './dto/updateDemandDto';
import { errorHandler } from '../error/error-mapper';
import NotFoundError from '../error/not-found.error';

@ApiTags('demands')
@Controller('demands')
@Injectable()
export class DemandsController {
  constructor(private readonly sequelize: Sequelize, private readonly demandsService: DemandsService) {}

  @ApiResponse({ isArray: true, type: Demand, description: 'returns single demand' })
  @Get('/:id')
  public async getDemand(@Param('id') id: string): Promise<Demand | void> {
    try {
      return await this.sequelize.transaction(async (transaction) => {
        const demand = await this.demandsService.getDemandById(transaction, id);

        if (!demand) {
          throw new NotFoundError(`Demand ${id} not found`);
        }

        return demand;
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  @ApiResponse({ type: Demand, description: 'creates demand and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createDemand(@Body() demandDto: CreateDemandDto): Promise<Demand | void> {
    try {
      const demand = await this.sequelize.transaction(async (transaction) => {
        return await this.demandsService.createDemand(transaction, demandDto);
      });

      if (!demand) {
        throw new CRUDError('CANNOT_CREATE_DEMAND');
      }

      return demand;
    } catch (error) {
      errorHandler(error);
    }
  }

  @ApiResponse({ type: Demand, description: 'updates demand and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateDemand(@Param('id') id: string, @Body() demandDto: UpdateDemandDto): Promise<Demand | void> {
    try {
      const demand = await this.sequelize.transaction(async (transaction) => {
        return await this.demandsService.updateDemand(transaction, id, demandDto);
      });

      if (!demand) {
        throw new CRUDError('CANNOT_UPDATE_DEMAND');
      }

      return demand;
    } catch (error) {
      errorHandler(error);
    }
  }
}
