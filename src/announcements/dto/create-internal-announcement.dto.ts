import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePublicAnnouncementDto } from './create-public-announcement.dto';

export class CreateInternalAnnouncementDto extends CreatePublicAnnouncementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  startDate?: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  endDate?: Date;
}
