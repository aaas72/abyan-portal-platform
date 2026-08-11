import {
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  WRITER = 'writer',
}

export class CreateUserDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  username: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن لا تقل عن 8 أحرف' })
  password: string;

  @IsEnum(UserRole, {
    message: 'الصلاحية غير صالحة. يجب أن تكون admin أو writer',
  })
  @IsOptional()
  role?: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
