import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../types/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
