import {
  Body,
  Controller,
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

import { DemandsService } from './services/demands.service';
import { CreateDemandDto } from './dto/createDemandDto';
import { Demand } from './models/demands.model';
import CRUDError from '../error/CRUDError';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { AuthGuard } from '../guards/authentication.guard';
import { UpdateDemandDto } from './dto/updateDemandDto';

@ApiTags('demands')
@Controller('demands')
@Injectable()
export class DemandsController {
  constructor(private readonly sequelize: Sequelize, private readonly demandsService: DemandsService) {}

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createDemand(@Body() demandDto: CreateDemandDto): Promise<Demand> {
    try {
      const demand = await this.sequelize.transaction(async (transaction) => {
        return await this.demandsService.createDemand(transaction, demandDto);
      });

      if (!demand) {
        throw new CRUDError();
      }

      return demand;
    } catch (error) {
      throw new HttpException('CANNOT_CREATE_DEMAND', HttpStatus.BAD_REQUEST);
    }
  }

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateDemand(@Param('id') id: string, @Body() demandDto: UpdateDemandDto): Promise<Demand> {
    try {
      const demand = await this.sequelize.transaction(async (transaction) => {
        return await this.demandsService.updateDemand(transaction, id, demandDto);
      });

      if (!demand) {
        throw new CRUDError();
      }

      return demand;
    } catch (error) {
      throw new HttpException('CANNOT_UPDATE_DEMAND', HttpStatus.BAD_REQUEST);
    }
  }
}
