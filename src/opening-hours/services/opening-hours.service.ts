import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { OpeningHours } from '../models/opening-hours.model';
import { CreateOpeningHoursDto } from '../dto/create-opening-hours.dto';

@Injectable()
export class OpeningHoursService {
  constructor(
    @InjectModel(OpeningHours)
    private readonly openingHoursModel: typeof OpeningHours,
  ) {}

  public async createOpeningHoursForPlace(
    transaction: Transaction,
    placeId: string,
    openingHoursList: CreateOpeningHoursDto[],
  ): Promise<OpeningHours[]> {
    for (const openingHours of openingHoursList) {
      await this.openingHoursModel.create({ placeId, ...openingHours }, { transaction });
    }

    return await this.openingHoursModel.findAll({ where: { placeId }, transaction });
  }

  public async updateOpeningHoursForPlace(
    transaction: Transaction,
    placeId: string,
    openingHoursList: CreateOpeningHoursDto[],
  ): Promise<OpeningHours[]> {
    for (const openingHours of openingHoursList) {
      const currentOpeningHours = await this.openingHoursModel.findOne({
        where: { placeId, day: openingHours.day },
        transaction,
      });

      if (currentOpeningHours) {
        await this.openingHoursModel.update(
          { ...openingHours },
          { where: { placeId, day: openingHours.day }, transaction },
        );
      } else {
        await this.openingHoursModel.create({ placeId, ...openingHours }, { transaction });
      }
    }

    return await this.openingHoursModel.findAll({ where: { placeId }, transaction });
  }
}
