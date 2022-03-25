import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsArray()
  @IsNotEmpty()
  links?: string[];
}
