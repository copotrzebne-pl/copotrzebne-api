import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  internalAnnouncementId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;
}
