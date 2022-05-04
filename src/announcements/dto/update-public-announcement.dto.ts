import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePublicAnnouncementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  contactInfo?: string;
}
