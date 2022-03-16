import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDemandDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placeId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  supplyId!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  priorityId!: string;
}
