import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlacesService } from './services/places.service';
import { PlacesController } from './places.controller';
import { Place } from './models/places.model';
import { DemandsService } from '../demands/services/demands.service';
import { Demand } from '../demands/models/demands.model';

@Module({
  imports: [SequelizeModule.forFeature([Place, Demand])],
  providers: [PlacesService, DemandsService],
  controllers: [PlacesController],
})
export class PlacesModule {}
