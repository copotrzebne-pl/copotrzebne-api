import { Body, Controller, HttpException, HttpStatus, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { MetadataKey } from '../types/metadata-key.enum';
import { UserRole } from './types/user-role.enum';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly sequelize: Sequelize, private readonly usersService: UsersService) {}

  @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.ADMIN])
  @UseGuards(AuthGuard)
  @Post('/')
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
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

      return user;
    } catch (error) {
      throw new HttpException('USER_CREATION_FAILED', HttpStatus.BAD_REQUEST);
    }
  }
}
