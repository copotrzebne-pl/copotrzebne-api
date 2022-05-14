import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnnouncementCommentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message?: string;
}
