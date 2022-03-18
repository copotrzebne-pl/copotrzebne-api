import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlacesService } from './services/places.service';
import { Place } from './models/places.model';
import { DemandsService } from '../demands/services/demands.service';
import { Demand } from '../demands/models/demands.model';
import { PlacesController } from './controllers/places.controller';
import { UsersPlacesController } from './controllers/users-places.controller';

@Module({
  imports: [SequelizeModule.forFeature([Place, Demand])],
  providers: [PlacesService, DemandsService],
  controllers: [PlacesController, UsersPlacesController],
})
export class PlacesModule {}
