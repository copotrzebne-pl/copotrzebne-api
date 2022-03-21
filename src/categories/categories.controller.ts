import { Controller, Get, Injectable, Query, UseFilters } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ErrorHandler } from '../error/errorHandler';
import { CategoriesService } from './services/categories.service';
import { Category } from './models/categories.model';
import { Language } from '../types/language.type.enum';

@ApiTags('categories')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly sequelize: Sequelize, private readonly categoriesService: CategoriesService) {}

  @ApiQuery({ name: 'sort', enum: Language })
  @ApiResponse({ isArray: true, type: Category, description: 'returns all categories' })
  @Get('/')
  public async getCategories(@Query('sort') sort?: Language): Promise<Category[] | void> {
    return await this.sequelize.transaction(async (transaction): Promise<Category[]> => {
      return await this.categoriesService.getAllCategories(transaction, sort);
    });
  }
}
