import {
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHighlightItemDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  category: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  linkText: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  href: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
