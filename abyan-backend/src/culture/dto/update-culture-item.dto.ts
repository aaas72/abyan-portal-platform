import {
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsString,
  MaxLength,
  IsArray,
} from 'class-validator';

export class UpdateCultureItemDto {
  @IsMongoId()
  @IsOptional()
  category?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  tag?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  location?: string;

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
  bgGradient?: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
