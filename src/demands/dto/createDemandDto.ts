import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDemandDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  @IsNotEmpty()
  placeId!: string;

  @IsString()
  @IsNotEmpty()
  supplyId!: string;

  @IsOptional()
  @IsString()
  priorityId!: string;
}
