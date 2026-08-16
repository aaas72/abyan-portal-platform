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

  @IsString()
  @MaxLength(500)
  @IsOptional()
  sourceName?: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  sourceUrl?: string;

  @IsArray()
  @IsOptional()
  sources?: Array<{ name: string; url?: string }>;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
