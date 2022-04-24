import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceLinkDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  homepage?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  signup?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  additional?: string[];
}
