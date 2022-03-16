import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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

import { Supply } from './models/supplies.model';
import { SuppliesService } from './services/supplies.service';
import CRUDError from '../error/CRUDError';
import { CreateSupplyDto } from './dto/createSupplyDto';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { AuthGuard } from '../guards/authentication.guard';
import { UpdateSupplyDto } from './dto/updateSupplyDto';

@ApiTags('supplies')
@Controller('supplies')
@Injectable()
export class SuppliesController {
  constructor(private readonly sequelize: Sequelize, private readonly suppliesService: SuppliesService) {}

  @ApiResponse({ isArray: true, type: Supply, description: 'returns all supplies' })
  @Get('/')
  public async getSupplies(): Promise<Supply[]> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Supply[]> => {
        return await this.suppliesService.getAllSupplies(transaction);
      });
    } catch (error) {
      throw new HttpException('CANNOT_GET_SUPPLIES', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({ type: Supply, description: 'creates supply and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createSupply(@Body() createSupplyDto: CreateSupplyDto): Promise<Supply> {
    try {
      const supply = await this.sequelize.transaction(async (transaction) => {
        return await this.suppliesService.createSupply(transaction, createSupplyDto);
      });

      if (!supply) {
        throw new CRUDError();
      }

      return supply;
    } catch (error) {
      throw new HttpException('CANNOT_CREATE_SUPPLY', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({ type: Supply, description: 'updates supply and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateSupply(@Param('id') id: string, @Body() supplyDto: UpdateSupplyDto): Promise<Supply> {
    try {
      const supply = await this.sequelize.transaction(async (transaction) => {
        return this.suppliesService.updateSupply(transaction, id, supplyDto);
      });

      if (!supply) {
        throw new CRUDError();
      }

      return supply;
    } catch (error) {
      throw new HttpException(`Cannot update Supply ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({ status: 204, description: 'deletes supply and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async deleteSupply(@Param('id') id: string): Promise<void> {
    try {
      await this.sequelize.transaction(async (transaction) => {
        await this.suppliesService.deleteSupply(transaction, id);
      });
    } catch (error) {
      throw new HttpException(`Cannot delete Supply ${id}`, HttpStatus.BAD_REQUEST);
    }
  }
}
