import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Supply } from './models/supplies.model';
import { SuppliesService } from './services/supplies.service';
import CRUDError from '../error/CRUD.error';
import { CreateSupplyDto } from './dto/createSupplyDto';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { AuthGuard } from '../guards/authentication.guard';
import { UpdateSupplyDto } from './dto/updateSupplyDto';
import NotFoundError from '../error/not-found.error';
import { ErrorHandler } from '../error/errorHandler';

@ApiTags('supplies')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly sequelize: Sequelize, private readonly suppliesService: SuppliesService) {}

  @ApiResponse({ isArray: true, type: Supply, description: 'returns single supply' })
  @Get('/:id')
  public async getSupply(@Param('id') id: string): Promise<Supply | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const supply = await this.suppliesService.getSupplyById(transaction, id);

      if (!supply) {
        throw new NotFoundError(`SUPPLY_NOT_FOUND`);
      }

      return supply;
    });
  }

  @ApiResponse({ isArray: true, type: Supply, description: 'returns all supplies' })
  @Get('/')
  public async getSupplies(): Promise<Supply[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.suppliesService.getAllSupplies(transaction);
    });
  }

  @ApiResponse({ type: Supply, description: 'creates supply and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createSupply(@Body() createSupplyDto: CreateSupplyDto): Promise<Supply | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const supply = await this.suppliesService.createSupply(transaction, createSupplyDto);

      if (!supply) {
        throw new CRUDError('CANNOT_CREATE_SUPPLY');
      }

      return supply;
    });
  }

  @ApiResponse({ type: Supply, description: 'updates supply and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateSupply(@Param('id') id: string, @Body() supplyDto: UpdateSupplyDto): Promise<Supply | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const supply = await this.suppliesService.updateSupply(transaction, id, supplyDto);

      if (!supply) {
        throw new CRUDError('CANNOT_UPDATE_SUPPLY');
      }

      return supply;
    });
  }

  @ApiResponse({ status: 204, description: 'deletes supply and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async deleteSupply(@Param('id') id: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      await this.suppliesService.deleteSupply(transaction, id);
    });
  }
}
