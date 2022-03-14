import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlacesService } from './services/places.service';
import { PlacesController } from './places.controller';
import { Place } from './models/places.model';

@Module({
  imports: [SequelizeModule.forFeature([Place])],
  providers: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
