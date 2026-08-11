import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLandmarkCategoryDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  subtitle: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

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
