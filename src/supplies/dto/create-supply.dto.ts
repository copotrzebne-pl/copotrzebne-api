import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  namePl!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameUa!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameEn!: string;
}
