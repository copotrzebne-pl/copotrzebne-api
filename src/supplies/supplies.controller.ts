import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
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
      throw new HttpException('CANNOT_GET_SUPPLIES', HttpStatus.BAD_REQUEST);
    }
  }

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
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
}
