import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplyDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  namePl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cityEn?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  streetUa?: string;
}
