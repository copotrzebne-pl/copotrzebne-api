import { IsOptional, IsString } from 'class-validator';

export class UpdateDemandDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  placeId?: string;

  @IsOptional()
  @IsString()
  supplyId?: string;

  @IsOptional()
  @IsString()
  priorityId?: string;
}
