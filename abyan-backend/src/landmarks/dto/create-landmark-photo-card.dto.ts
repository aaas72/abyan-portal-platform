import {
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsArray,
} from 'class-validator';

export class CreateLandmarkPhotoCardDto {
  @IsMongoId()
  @IsNotEmpty()
  category: string;

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

  @IsString({ message: 'اسم الكاتب / الباحث التوثيقي يجب أن يكون نصاً' })
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

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bgGradient?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  startYear?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  endYear?: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
