import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOpeningHoursDto } from '../../opening-hours/dto/create-opening-hours.dto';

export class UpdatePlaceDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  street?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  buildingNumber?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ nullable: false })
  @IsArray()
  openingHours!: CreateOpeningHoursDto[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  lastUpdatedAt?: Date;
}
