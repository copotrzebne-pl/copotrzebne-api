import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDemandDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  placeId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  supplyId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  priorityId?: string;
}
