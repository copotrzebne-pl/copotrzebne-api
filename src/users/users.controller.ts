import { Body, Controller, Get, Post, SetMetadata, UseFilters, UseGuards } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from './types/user-role.enum';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/authentication.guard';
import { SessionUserId } from '../decorators/session-user-id.decorator';
import { AuthorizationError } from '../error/authorization.error';
import { ErrorHandler } from '../error/errorHandler';

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
        role: { type: 'string', enum: [UserRole.ADMIN, UserRole.SERVICE, UserRole.PLACE_MANAGER] },
      },
    },
  })
  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<{ login: string; id: string; role: string }> {
    const { login, password, role } = createUserDto;
    const user = await this.sequelize.transaction(async (transaction): Promise<User | null> => {
      return await this.usersService.createUser(transaction, {
        login,
        password,
        role,
      });
    });

    if (!user) {
      throw new Error('USER_CREATION_FAILED');
    }

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
  public async whoami(
    @SessionUserId() userId: string | null,
  ): Promise<{ login: string; id: string; role: string } | void> {
    if (!userId) {
      throw new AuthorizationError('ACCESS_FORBIDDEN');
    }

    const user = await this.sequelize.transaction(async (transaction): Promise<User | null> => {
      return await this.usersService.getUserById(transaction, userId);
    });

    if (!user) {
      throw new AuthorizationError('ACCESS_FORBIDDEN');
    }

    return { login: user.login, id: user.id, role: user.role };
  }
}
