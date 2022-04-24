import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceLinkDto } from '../../place-links/dto/place-link.dto';

export class CreateCommentDto {
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
  placeId!: string;

  @ApiProperty()
  @IsOptional()
  link?: PlaceLinkDto;
}
