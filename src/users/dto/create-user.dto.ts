import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../types/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
