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

class CreateLandmarkDetailDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  category?: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;
}

class CreatePioneerDetailDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  role: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  era?: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;
}

class CreateDistrictCardItemDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  subtitle?: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

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

export class CreateDistrictDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  region: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  regionLabel: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  capital: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  areaKm2: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  areaPercentage: string;

  @IsArray()
  @IsString({ each: true })
  crops: string[];

  @IsArray()
  @IsString({ each: true })
  landmarks: string[];

  @IsArray()
  @IsString({ each: true })
  villages: string[];

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  geography: string;

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
  @Type(() => CreateLandmarkDetailDto)
  @IsOptional()
  landmarksList?: CreateLandmarkDetailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePioneerDetailDto)
  @IsOptional()
  pioneersList?: CreatePioneerDetailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDistrictCardItemDto)
  @IsOptional()
  pioneersCardList?: CreateDistrictCardItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDistrictCardItemDto)
  @IsOptional()
  sitesCardList?: CreateDistrictCardItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDistrictCardItemDto)
  @IsOptional()
  cropsCardList?: CreateDistrictCardItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDistrictCardItemDto)
  @IsOptional()
  heritageCardList?: CreateDistrictCardItemDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
