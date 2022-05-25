import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TranslatedField } from '../../types/translated-field.type';

export class CreateSupplyDto {
  @ApiProperty()
  @IsNotEmpty()
  name!: TranslatedField;
}
