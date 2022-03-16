import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiTags } from '@nestjs/swagger';

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

  @Get('/')
  public async getSupplies(): Promise<Supply[]> {
    try {
      return await this.sequelize.transaction(async (transaction): Promise<Supply[]> => {
        return await this.suppliesService.getAllSupplies(transaction);
      });
    } catch (error) {
      throw new HttpException('Cannot get supplies', HttpStatus.BAD_REQUEST);
    }
  }

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
      throw new HttpException('Cannot create Supply', HttpStatus.BAD_REQUEST);
    }
  }

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

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Delete('/:id')
  public async deleteSupply(@Param('id') id: string): Promise<string> {
    try {
      await this.sequelize.transaction(async (transaction) => {
        await this.suppliesService.deleteSupply(transaction, id);
      });

      return `Supply ${id} deleted`;
    } catch (error) {
      throw new HttpException(`Cannot delete Supply ${id}`, HttpStatus.BAD_REQUEST);
    }
  }
}
