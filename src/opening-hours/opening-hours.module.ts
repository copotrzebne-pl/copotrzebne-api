import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { OpeningHoursService } from './services/opening-hours.service';
import { OpeningHours } from './models/opening-hours.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([OpeningHours])],
  providers: [OpeningHoursService],
  controllers: [],
  exports: [OpeningHoursService],
})
export class OpeningHoursModule {}
