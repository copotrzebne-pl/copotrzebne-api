import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Demand } from './models/demands.model';
import { DemandsService } from './services/demands.service';

@Module({
  imports: [SequelizeModule.forFeature([Demand])],
  providers: [DemandsService],
  controllers: [],
})
export class DemandsModule {}
