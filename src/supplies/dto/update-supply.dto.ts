import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TranslatedField } from '../../types/translated-field.type';

export class UpdateSupplyDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  name?: TranslatedField;
}
