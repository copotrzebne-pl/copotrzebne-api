import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceLinkDto } from '../../place-links/dto/place-link.dto';

export class UpdateCommentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message?: string;

  @ApiProperty()
  @IsOptional()
  link?: PlaceLinkDto;
}
