import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Demand } from './models/demand.model';
import { DemandsService } from './services/demands.service';
import { DemandsController } from './demands.controller';

@Module({
  imports: [SequelizeModule.forFeature([Demand])],
  providers: [DemandsService],
  controllers: [DemandsController],
})
export class DemandsModule {}
