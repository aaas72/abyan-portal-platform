import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';

/** مدة صلاحية رمز استعادة كلمة المرور — قصيرة عمداً لتقليص نافذة الاستغلال */
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** يخزَّن في قاعدة البيانات تجزئة الرمز لا الرمز نفسه، حتى لا يفيد تسرّب القاعدة المهاجم */
  private hashResetToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    // الفحص بعد التحقق من كلمة المرور عمداً: من يصل إلى هنا يملك بيانات صحيحة
    // أصلاً، فلا تسريب لوجود الحسابات. القيمة الافتراضية true تُبقي الحسابات
    // القديمة التي لا تحمل الحقل فعّالة.
    if (user.isActive === false) {
      throw new UnauthorizedException('هذا الحساب معطّل، راجع مدير النظام');
    }

    const payload = { sub: user._id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // مستند حيّ لا lean: هذا المسار يعدّل ثم يستدعي user.save()
    const user = await this.usersService.findDocumentById(userId);
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('كلمة المرور القديمة غير صحيحة');
    }

    user.password = changePasswordDto.newPassword;
    await user.save(); // pre-save hook will hash the new password
    return { message: 'تم تغيير كلمة المرور بنجاح' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // نفس الرسالة في كل الحالات حتى لا يكشف المسار من هم المستخدمون الموجودون
    const genericResponse = {
      message: 'إذا كان اسم المستخدم صحيحاً، فقد تم اتخاذ الإجراء المناسب',
    };

    // مستند حيّ لا lean: هذا المسار يعدّل ثم يستدعي user.save()
    const user = await this.usersService.findDocumentByUsername(
      forgotPasswordDto.username,
    );
    if (!user) {
      return genericResponse;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = this.hashResetToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    // الرمز لا يُعاد في الاستجابة إطلاقاً — وإلا استطاع أي شخص يعرف اسم مستخدم
    // أن يستولي على حسابه بطلبين متتاليين.
    // TODO: أرسل الرمز عبر البريد أو الرسائل النصية قبل النشر في الإنتاج.
    if (process.env.NODE_ENV !== 'production') {
      this.logger.warn(
        `[تطوير فقط] رمز استعادة كلمة المرور للمستخدم ${user.username}: ${resetToken}`,
      );
    }

    return genericResponse;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(
      this.hashResetToken(resetPasswordDto.token),
    );
    if (!user) {
      throw new BadRequestException('رمز الاستعادة غير صالح أو منتهي الصلاحية');
    }

    user.password = resetPasswordDto.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save(); // pre-save hook will hash

    return { message: 'تم إعادة تعيين كلمة المرور بنجاح' };
  }
}
