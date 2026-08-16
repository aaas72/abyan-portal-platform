import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';

export class UpdateArchiveItemDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  category?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  categoryLabel?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  year?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  location?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  aspectRatio?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  authorName?: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
