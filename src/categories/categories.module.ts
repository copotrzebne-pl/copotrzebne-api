import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/categories.model';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
