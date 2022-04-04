import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOpeningHoursDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  day!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  openTime!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  closeTime!: string;
}
