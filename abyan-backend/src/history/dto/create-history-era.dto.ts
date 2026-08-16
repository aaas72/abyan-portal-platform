import {
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHistoryEraDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  startYear: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  endYear: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  eraTitle: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  historicalCapital: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  shortSummary: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  fullDescription: string;

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

  @IsString()
  @IsOptional()
  timeframe?: string;
}
