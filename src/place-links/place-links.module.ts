import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlaceLink } from './models/place-link.model';

@Module({
  imports: [SequelizeModule.forFeature([PlaceLink])],
  providers: [],
  controllers: [],
})
export class PlaceLinksModule {}
