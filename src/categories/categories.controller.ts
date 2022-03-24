import { Controller, Get, Injectable, UseFilters } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ErrorHandler } from '../error/error-handler';
import { CategoriesService } from './services/categories.service';
import { Category } from './models/categories.model';

@ApiTags('categories')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly sequelize: Sequelize, private readonly categoriesService: CategoriesService) {}

  @ApiResponse({ isArray: true, type: Category, description: 'returns all categories' })
  @Get('/')
  public async getCategories(): Promise<Category[] | void> {
    return await this.sequelize.transaction(async (transaction): Promise<Category[]> => {
      return await this.categoriesService.getAllCategories(transaction);
    });
  }
}
