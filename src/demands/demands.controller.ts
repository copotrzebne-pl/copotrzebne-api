import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
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

@ApiTags('demands')
@Controller('demands')
@Injectable()
export class DemandsController {
  constructor(private readonly sequelize: Sequelize, private readonly demandsService: DemandsService) {}

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

  @ApiResponse({ status: 204, description: 'deletes demand and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  public async deleteDemand(@Param('id') id: string): Promise<void> {
    try {
      await this.sequelize.transaction(async (transaction) => {
        await this.demandsService.deleteDemand(transaction, id);
      });
    } catch (error) {
      errorHandler(error);
    }
  }
}
