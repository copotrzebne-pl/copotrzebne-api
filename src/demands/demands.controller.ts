import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { DemandsService } from './services/demands.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { Demand } from './models/demand.model';
import CRUDError from '../error/crud.error';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from '../users/types/user-role.enum';
import { AuthGuard } from '../guards/authentication.guard';
import { UpdateDemandDto } from './dto/update-demand.dto';
import NotFoundError from '../error/not-found.error';
import { ErrorHandler } from '../error/error-handler';
import { AuthorizationError } from '../error/authorization.error';
import { SessionUser } from '../decorators/session-user.decorator';
import { User } from '../users/models/user.model';
import { PlacesService } from '../places/services/places.service';
import { Action } from '../journals/types/action.enum';
import { JournalsService } from '../journals/services/journals.service';

@ApiTags('demands')
@Injectable()
@UseFilters(ErrorHandler)
@Controller('demands')
export class DemandsController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly demandsService: DemandsService,
    private readonly placesService: PlacesService,
    private readonly journalsService: JournalsService,
  ) {}

  @ApiResponse({ isArray: true, type: Demand, description: 'returns single demand' })
  @Get('/:id')
  public async getDemand(@Param('id') id: string): Promise<Demand | void> {
    return await this.sequelize.transaction(async (transaction) => {
      const demand = await this.demandsService.getDemandById(transaction, id);

      if (!demand) {
        throw new NotFoundError(`DEMAND_NOT_FOUND`);
      }

      return demand;
    });
  }

  @ApiResponse({ type: Demand, description: 'creates demand and returns created entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createDemand(@SessionUser() user: User, @Body() demandDto: CreateDemandDto): Promise<Demand | void> {
    const demand = await this.sequelize.transaction(async (transaction) => {
      if (!(await this.placesService.isPlaceManageableByUser(transaction, user, demandDto.placeId))) {
        throw new AuthorizationError();
      }

      return await this.demandsService.createDemand(transaction, demandDto);
    });

    if (!demand) {
      throw new CRUDError('CANNOT_CREATE_DEMAND');
    }

    this.journalsService.logInJournal({
      action: Action.ADD_DEMAND,
      user: user.login,
      details: `Demand ${demand.id} added added to place ${demandDto.placeId}`,
    });

    return demand;
  }

  @ApiResponse({ type: Demand, description: 'updates demand and returns updated entity' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Patch('/:id')
  public async updateDemand(
    @SessionUser() user: User,
    @Param('id') id: string,
    @Body() demandDto: UpdateDemandDto,
  ): Promise<Demand | void> {
    const demand = await this.sequelize.transaction(async (transaction) => {
      const demand = await this.demandsService.getDemandById(transaction, id);
      if (!demand) {
        throw new NotFoundError('DEMAND_NOT_FOUND');
      }

      if (!(await this.placesService.isPlaceManageableByUser(transaction, user, demand.placeId))) {
        throw new AuthorizationError();
      }

      return await this.demandsService.updateDemand(transaction, id, demandDto);
    });

    if (!demand) {
      throw new CRUDError('CANNOT_UPDATE_DEMAND');
    }

    this.journalsService.logInJournal({
      action: Action.EDIT_DEMAND,
      user: user.login,
      details: `Demand ${demand.id} edited for place ${demandDto.placeId}`,
    });

    return demand;
  }

  @ApiResponse({ status: 204, description: 'deletes demand and returns empty response' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async deleteDemand(@SessionUser() user: User, @Param('id') id: string): Promise<void> {
    const placeId = await this.sequelize.transaction(async (transaction): Promise<string> => {
      const demand = await this.demandsService.getDemandById(transaction, id);
      if (!demand) {
        throw new NotFoundError('DEMAND_NOT_FOUND');
      }

      if (!(await this.placesService.isPlaceManageableByUser(transaction, user, demand.placeId))) {
        throw new AuthorizationError();
      }

      this.journalsService.logInJournal({
        action: Action.DELETE_DEMAND,
        user: user.login,
        details: `Demand ${demand.id} edited from place ${demand.placeId}`,
      });

      await this.demandsService.deleteDemand(transaction, id);

      return demand.placeId;
    });

    this.journalsService.logInJournal({
      action: Action.DELETE_DEMAND,
      user: user.login,
      details: `Demand ${id} edited from place ${placeId}`,
    });
  }
}
