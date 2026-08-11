import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { RequestUser } from '../../common/interfaces/request-user.interface';

/**
 * لا توجد قيمة احتياطية آمنة لمفتاح التوقيع: مفتاح مكتوب في الشيفرة يعني
 * أن أي شخص يقرأها يستطيع تزوير رمز مدير. الأفضل أن يفشل الإقلاع بصوت عالٍ.
 */
function requireJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_SECRET مطلوب — عرّفه في ملف .env');
  }
  return secret;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    const extractJwtFromCookie = (req: any) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: requireJwtSecret(configService),
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.usersService.findById(payload.sub);
    // بدون فحص isActive يظل الرمز الصادر قبل التعطيل صالحاً حتى انتهاء مدته،
    // أي أن تعطيل الحساب لا يطرد صاحبه فعلياً.
    if (!user || user.isActive === false) {
      throw new UnauthorizedException();
    }
    return {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      name: user.name,
    };
  }
}
