import {
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateArchiveItemDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  category: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  categoryLabel: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  year: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  location: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  aspectRatio: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  bgGradient: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

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
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
