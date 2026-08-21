import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PrivacyItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  items?: string[];
}

export class UpdatePrivacyDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrivacyItemDto)
  intro?: PrivacyItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrivacyItemDto)
  dataCollection?: PrivacyItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrivacyItemDto)
  usageAndProtection?: PrivacyItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrivacyItemDto)
  cookiesAndAnalytics?: PrivacyItemDto[];
}
