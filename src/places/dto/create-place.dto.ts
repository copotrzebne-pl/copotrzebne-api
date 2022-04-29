import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceLinkDto } from '../../place-links/dto/place-link.dto';

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
  @IsString()
  bankAccount?: string;

  @ApiProperty()
  @IsOptional()
  placeLink?: PlaceLinkDto;
}
