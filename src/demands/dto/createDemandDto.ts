import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDemandDto {
  @IsString()
  comment!: string;

  @IsString()
  @IsNotEmpty()
  placeId!: string;

  @IsString()
  @IsNotEmpty()
  supplyId!: string;

  @IsString()
  @IsNotEmpty()
  priorityId!: string;
}
