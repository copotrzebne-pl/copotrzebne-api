import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TranslatedField } from '../../types/translated.field.type';
import { PlaceLinkDto } from '../../place-links/dto/place-link.dto';

export class UpdatePlaceDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: TranslatedField;

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
  additionalDescription?: string;

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

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  lastUpdatedAt?: Date | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  bankAccountDescription?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  resources?: string;

  @ApiProperty()
  @IsOptional()
  placeLink?: PlaceLinkDto;
}
