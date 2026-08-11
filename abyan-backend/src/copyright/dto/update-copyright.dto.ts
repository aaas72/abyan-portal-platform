import {
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CopyrightItemDto {
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

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  summary?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  items?: string[];
}

export class UpdateCopyrightContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CopyrightItemDto)
  @IsOptional()
  declarations?: CopyrightItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CopyrightItemDto)
  @IsOptional()
  pillars?: CopyrightItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CopyrightItemDto)
  @IsOptional()
  guidelines?: CopyrightItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CopyrightItemDto)
  @IsOptional()
  contactNotice?: CopyrightItemDto[];
}
