import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreatePlaceDto } from './create-place.dto';

export class CreateDraftPlaceDto extends CreatePlaceDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  userEmail!: string;
}
