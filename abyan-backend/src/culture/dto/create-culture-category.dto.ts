import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateAudioTrackDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  artist: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  category: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  duration: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  lyricsExcerpt: string;
}

class CreateVisualShowcaseDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  tag: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  bgGradient: string;
}

export class CreateCultureCategoryDto {
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
  primaryTags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAudioTrackDto)
  audioTrack?: CreateAudioTrackDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVisualShowcaseDto)
  visualShowcase?: CreateVisualShowcaseDto;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
