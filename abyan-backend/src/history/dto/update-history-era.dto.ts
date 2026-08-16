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
