import { Controller, Post, Body, UseGuards, Put, Res } from '@nestjs/common';
import express from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } = await this.authService.login(loginDto);

    // Set HTTP-only cookie with the token
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // الرمز لا يُعاد في الجسم: الكوكي httpOnly هو المرجع، والواجهة لا تقرأ
    // الرمز إطلاقاً. إعادته هنا تُبقي نسخة منه في متناول أي سكربت في الصفحة.
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response) {
    // Clear the cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { message: 'تم تسجيل الخروج بنجاح' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @CurrentUser() user: RequestUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.userId, changePasswordDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
