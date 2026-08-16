import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsString,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateLandmarkDetailDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  category?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;
}

class UpdatePioneerDetailDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  role?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  era?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;
}

class UpdateDistrictCardItemDto {
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

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  fullBiography?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;
}

export class UpdateDistrictDto {
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
  region?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  regionLabel?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  capital?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  areaKm2?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  areaPercentage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  crops?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  landmarks?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  villages?: string[];

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

  @IsString()
  @MaxLength(500)
  @IsOptional()
  geography?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  oldName?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  historyOverview?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  historyMilestones?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  climateAndNature?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  famousPioneers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  pioneersDetails?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  historicalSites?: string[];

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  economyDetails?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  naturalResources?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  traditionsAndCulture?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  folkHeritage?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLandmarkDetailDto)
  @IsOptional()
  landmarksList?: UpdateLandmarkDetailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePioneerDetailDto)
  @IsOptional()
  pioneersList?: UpdatePioneerDetailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDistrictCardItemDto)
  @IsOptional()
  pioneersCardList?: UpdateDistrictCardItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDistrictCardItemDto)
  @IsOptional()
  sitesCardList?: UpdateDistrictCardItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDistrictCardItemDto)
  @IsOptional()
  cropsCardList?: UpdateDistrictCardItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDistrictCardItemDto)
  @IsOptional()
  heritageCardList?: UpdateDistrictCardItemDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
