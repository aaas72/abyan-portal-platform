import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateDistrictRegionDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  regionKey: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  regionLabel: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
