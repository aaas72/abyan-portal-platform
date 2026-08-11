import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateLandmarkCategoryDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  categoryName?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  subtitle?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keyLandmarks?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details?: string[];
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
