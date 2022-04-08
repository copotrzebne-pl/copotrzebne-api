import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { JournalsService } from '../journals/services/journals.service';
import { Action } from '../journals/types/action.enum';
import { User } from '../users/models/user.model';

@ApiTags('authentication')
@Controller()
export class AuthenticationController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly authenticationService: AuthenticationService,
    private readonly journalsService: JournalsService,
  ) {}

  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        jwt: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    schema: {
      example: {
        statusCode: 403,
        message: 'FAILED_TO_LOGIN',
      },
    },
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ jwt: string }> {
    const { login, password } = loginDto;

    const { jwt, user } = await this.sequelize.transaction(
      async (transaction): Promise<{ user: User; jwt: string }> => {
        try {
          return await this.authenticationService.createSessionOrFail(transaction, { login, password });
        } catch (error) {
          throw new HttpException('FAILED_TO_LOGIN', HttpStatus.FORBIDDEN);
        }
      },
    );

    this.journalsService.logInJournal({
      user: user.login,
      action: Action.LOGIN,
    });

    return {
      jwt,
    };
  }
}
