import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Supply } from './models/supplies.model';
import { SuppliesService } from './services/supplies.service';
import { SuppliesController } from './supplies.controller';

@Module({
  imports: [SequelizeModule.forFeature([Supply])],
  providers: [SuppliesService],
  controllers: [SuppliesController],
})
export class SuppliesModule {}
