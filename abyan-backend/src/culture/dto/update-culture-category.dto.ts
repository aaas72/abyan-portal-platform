import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsString,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateAudioTrackDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  artist?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  category?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  duration?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  lyricsExcerpt?: string;
}

class UpdateVisualShowcaseDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  tag?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;
}

export class UpdateCultureCategoryDto {
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
  primaryTags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAudioTrackDto)
  audioTrack?: UpdateAudioTrackDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateVisualShowcaseDto)
  visualShowcase?: UpdateVisualShowcaseDto;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
