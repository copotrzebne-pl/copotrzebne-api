import { Controller, Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Supply } from './models/supplies.model';
import { SuppliesService } from './services/supplies.service';

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
}
