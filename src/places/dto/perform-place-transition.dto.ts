import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PerformPlaceTransitionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transition!: string;
}
