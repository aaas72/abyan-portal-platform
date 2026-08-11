import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';

export class UpdatePioneerCategoryDto {
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
  keyFigures?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
