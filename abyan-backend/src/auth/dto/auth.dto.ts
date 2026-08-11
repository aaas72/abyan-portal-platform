import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  username: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'كلمة المرور القديمة مطلوبة' })
  oldPassword: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن لا تقل عن 8 أحرف' })
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  username: string;
}

export class ResetPasswordDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'رمز الاستعادة (Token) مطلوب' })
  token: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن لا تقل عن 8 أحرف' })
  newPassword: string;
}
