import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlaceDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNotEmpty()
  street?: string;

  @IsOptional()
  @IsNotEmpty()
  buildingNumber?: string;

  @IsOptional()
  @IsString()
  apartment?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  latitude?: string;

  @IsOptional()
  @IsNumber()
  longitude?: string;
}
