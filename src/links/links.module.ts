import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Link } from './models/link.model';

@Module({
  imports: [SequelizeModule.forFeature([Link])],
  providers: [],
  controllers: [],
})
export class LinksModule {}
