import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Journal } from './models/journal.model';
import { JournalsService } from './services/journals.service';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Journal])],
  providers: [JournalsService],
  exports: [JournalsService],
})
export class JournalsModule {}
