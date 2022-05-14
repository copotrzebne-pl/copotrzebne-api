import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePublicAnnouncementDto } from './update-public-announcement.dto';

export class UpdateInternalAnnouncementDto extends UpdatePublicAnnouncementDto {
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
