import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicAnnouncementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placeId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  contactInfo?: string;
}
