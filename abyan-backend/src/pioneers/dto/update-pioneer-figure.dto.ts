import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  MaxLength,
} from 'class-validator';

export class UpdatePioneerFigureDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  category?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  origin?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  startYear?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  endYear?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  biography?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  quote?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  birthDate?: string;

  @IsArray()
  @IsOptional()
  achievements?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];
}
