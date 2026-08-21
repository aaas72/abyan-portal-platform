import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TermsItemDto {
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

export class UpdateTermsDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TermsItemDto)
  intro?: TermsItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TermsItemDto)
  usageRules?: TermsItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TermsItemDto)
  intellectualProperty?: TermsItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TermsItemDto)
  disclaimer?: TermsItemDto[];
}
