import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceTransitionName } from '../types/place.transition-name.enum';

export class PerformPlaceTransitionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transition!: PlaceTransitionName;
}
