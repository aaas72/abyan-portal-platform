import {
  IsBoolean,
  IsOptional,
  IsEnum,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserRole } from './create-user.dto';

export class UpdateUserDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  username?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @MinLength(8, { message: 'كلمة المرور يجب أن لا تقل عن 8 أحرف' })
  password?: string;

  @IsEnum(UserRole, {
    message: 'الصلاحية غير صالحة. يجب أن تكون admin أو writer',
  })
  @IsOptional()
  role?: string;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
