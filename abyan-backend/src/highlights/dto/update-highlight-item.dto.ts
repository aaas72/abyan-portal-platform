import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateHighlightItemDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  category?: string;

  @IsString()
  @MaxLength(10000)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  linkText?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  href?: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
