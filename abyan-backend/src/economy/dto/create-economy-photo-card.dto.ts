import {
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateEconomyPhotoCardDto {
  @IsMongoId()
  @IsNotEmpty()
  pillar: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  tag: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  location: string;

  @IsString()
  @MaxLength(10000)
  @IsNotEmpty()
  description: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  bgGradient: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
