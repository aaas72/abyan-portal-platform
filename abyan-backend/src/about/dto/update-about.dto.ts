import {
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class AboutPillarDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  _id?: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  @MaxLength(10000)
  description: string;
}

class AboutValueDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  _id?: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  @MaxLength(10000)
  description: string;
}

class AboutScopeDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  _id?: string;

  @IsString()
  @MaxLength(500)
  title: string;

  @IsString()
  @MaxLength(500)
  summary: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];
}

class AboutStatDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  _id?: string;

  @IsString()
  @MaxLength(500)
  number: string;

  @IsString()
  @MaxLength(500)
  label: string;
}

export class UpdateAboutContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutPillarDto)
  @IsOptional()
  pillars?: AboutPillarDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutValueDto)
  @IsOptional()
  values?: AboutValueDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutScopeDto)
  @IsOptional()
  scopes?: AboutScopeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutStatDto)
  @IsOptional()
  stats?: AboutStatDto[];
}
