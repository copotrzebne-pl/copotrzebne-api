import { Body, Controller, Delete, Get, Param, Post, SetMetadata, UseFilters, UseGuards } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from './types/user-role.enum';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/authentication.guard';
import { ErrorHandler } from '../error/error-handler';
import { SessionUser } from '../decorators/session-user.decorator';

@ApiTags('users')
@UseFilters(ErrorHandler)
@Controller('users')
export class UsersController {
  constructor(private readonly sequelize: Sequelize, private readonly usersService: UsersService) {}

  @ApiResponse({
    schema: {
      properties: {
        id: { type: 'string' },
        login: { type: 'string' },
        placeId: { type: 'string', nullable: true },
        role: { type: 'string', enum: [UserRole.ADMIN, UserRole.SERVICE, UserRole.PLACE_MANAGER] },
      },
    },
  })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<{ login: string; id: string; role: string }> {
    const { login, password, role } = createUserDto;
    const user = await this.sequelize.transaction(async (transaction): Promise<User> => {
      const user = await this.usersService.createUser(transaction, {
        login,
        password,
        role,
      });

      if (!user) {
        throw new Error('USER_CREATION_FAILED');
      }

      if (createUserDto.placeId) {
        await this.usersService.assignPlaceToUser(transaction, createUserDto.placeId, user.id);
      }

      return user;
    });

    return { login: user.login, id: user.id, role: user.role };
  }

  @ApiHeader({ name: 'authorization' })
  @ApiResponse({
    schema: {
      properties: {
        id: { type: 'string' },
        login: { type: 'string' },
        role: { type: 'string', enum: [UserRole.ADMIN, UserRole.SERVICE, UserRole.PLACE_MANAGER] },
      },
    },
  })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN, UserRole.SERVICE, UserRole.PLACE_MANAGER])
  @UseGuards(AuthGuard)
  @Get('/whoami')
  public async whoami(@SessionUser() user: User): Promise<{ login: string; id: string; role: string } | void> {
    return { login: user.login, id: user.id, role: user.role };
  }

  @ApiResponse({ type: User, isArray: true, description: 'Returns list of users. Access for admins only.' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Get('/')
  public async getUsers(): Promise<User[] | void> {
    return await this.sequelize.transaction(async (transaction) => {
      return await this.usersService.getAllUsers(transaction);
    });
  }

  @ApiResponse({ status: 204, description: 'Removes a user. Access for admins only.' })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Delete('/:id')
  public async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      return await this.usersService.removeUserById(transaction, userId);
    });
  }
}
