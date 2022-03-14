import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupplyDto {
  @IsString()
  @IsNotEmpty()
  namePl!: string;

  @IsString()
  @IsNotEmpty()
  nameUa!: string;

  @IsString()
  @IsNotEmpty()
  nameEn!: string;
}
