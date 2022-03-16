import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplyDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  namePl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cityEn?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  streetUa?: string;
}
