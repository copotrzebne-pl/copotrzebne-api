import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from './types/user-role.enum';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/authentication.guard';
import { JwtService } from '../jwt/jwt.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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
    try {
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
    } catch (error) {
      throw new HttpException('USER_CREATION_FAILED', HttpStatus.BAD_REQUEST);
    }
  }

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
    @Headers('authorization') authHeader: string,
  ): Promise<{ login: string; id: string; role: string }> {
    const token = this.jwtService.getAuthorizationToken(authHeader);
    if (!token) {
      throw new Error('ACCESS_FORBIDDEN');
    }

    const jwtPayload = this.jwtService.getPayloadFromToken(token);
    if (!jwtPayload) {
      throw new Error('ACCESS_FORBIDDEN');
    }

    const userId = jwtPayload.user.id;
    try {
      const user = await this.sequelize.transaction(async (transaction): Promise<User | null> => {
        return await this.usersService.getUserById(transaction, userId);
      });

      if (!user) {
        throw new Error('ACCESS_FORBIDDEN');
      }

      return { login: user.login, id: user.id, role: user.role };
    } catch (error) {
      throw new HttpException('ACCESS_FORBIDDEN', HttpStatus.FORBIDDEN);
    }
  }
}
