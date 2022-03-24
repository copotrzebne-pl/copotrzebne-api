import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersPlaces } from './models/user-place.model';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([User, UsersPlaces])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
