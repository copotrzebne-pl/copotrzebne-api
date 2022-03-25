import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Priority } from './models/priority.model';
import { PrioritiesService } from './services/priorities.service';
import { PrioritiesController } from './priorities.controller';

@Module({
  imports: [SequelizeModule.forFeature([Priority])],
  providers: [PrioritiesService],
  controllers: [PrioritiesController],
})
export class PrioritiesModule {}
