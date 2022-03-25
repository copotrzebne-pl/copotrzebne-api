import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Demand } from './models/demands.model';
import { DemandsService } from './services/demands.service';
import { DemandsController } from './demands.controller';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [SequelizeModule.forFeature([Demand]), PlacesModule],
  providers: [DemandsService],
  controllers: [DemandsController],
})
export class DemandsModule {}
