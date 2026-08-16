import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreatePioneerFigureDto {
  @IsString({ message: 'الاسم يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsString({ message: 'اللقب / الصفة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اللقب / الصفة مطلوبة' })
  title: string;

  @IsString({ message: 'التصنيف يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'معرف التصنيف مطلوب' })
  category: string;

  @IsString({ message: 'المنشأ يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'المنشأ / المديرية مطلوبة' })
  origin: string;

  @IsString({ message: 'السيرة الذاتية يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'السيرة الذاتية مطلوبة' })
  biography: string;

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
  @IsNotEmpty()
  startYear: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  endYear: string;

  @IsString({ message: 'تاريخ الميلاد يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'تاريخ الميلاد مطلوب' })
  birthDate: string;

  @IsString({ message: 'تاريخ الوفاة يجب أن يكون نصاً' })
  @IsOptional()
  deathDate?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  quote?: string;

  @IsArray({ message: 'الإنجازات يجب أن تكون مصفوفة' })
  @IsNotEmpty({ message: 'يجب إضافة إنجاز واحد على الأقل' })
  achievements: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];
}
