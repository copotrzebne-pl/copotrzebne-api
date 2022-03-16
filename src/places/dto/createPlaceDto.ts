import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buildingNumber!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
