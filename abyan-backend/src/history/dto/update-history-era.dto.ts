import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateHistoryEraDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  startYear?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  endYear?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  timeframe?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  eraTitle?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  historicalCapital?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  shortSummary?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  fullDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keyEvents?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  notableLandmarks?: string[];
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
