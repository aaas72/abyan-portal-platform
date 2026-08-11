import {
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreatePioneerCategoryDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'اسم التصنيف (Category Name) مطلوب' })
  categoryName: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'العنوان (Title) مطلوب' })
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'العنوان الفرعي (Subtitle) مطلوب' })
  subtitle: string;

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
