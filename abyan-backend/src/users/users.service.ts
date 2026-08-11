import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * نتيجة استعلام lean: كائن JavaScript عادي، أخفّ وأسرع من مستند Mongoose
 * لكنه **بلا توابع المستند** — لا save() ولا toObject().
 * أي مسار يحتاج التعديل والحفظ يجب أن يستخدم توابع findDocument* أدناه.
 */
export type LeanUser = FlattenMaps<User> & { _id: Types.ObjectId };

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ── قراءة فقط: lean لأداء أفضل (مسار التحقق من الرمز يمرّ هنا في كل طلب) ──

  async findOneByUsername(username: string): Promise<LeanUser | null> {
    return this.userModel.findOne({ username }).lean<LeanUser>().exec();
  }

  async findById(id: string): Promise<LeanUser | null> {
    return this.userModel.findById(id).lean<LeanUser>().exec();
  }

  // ── تعديل وحفظ: مستند حيّ، بلا lean، وإلا فشل user.save() وقت التشغيل ──

  async findDocumentByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findDocumentById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  /** @param tokenHash تجزئة SHA-256 للرمز — القاعدة لا تخزّن الرمز الخام إطلاقاً */
  async findByResetToken(tokenHash: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: new Date() },
      })
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean()
      .exec() as unknown as User[];
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const createdUser = new this.userModel(createUserDto);
    const saved = await createdUser.save();
    const { password, ...result } = saved.toObject();
    return result;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User> | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.role) user.role = updateUserDto.role;
    if (updateUserDto.password) {
      user.password = updateUserDto.password; // The pre-save hook will hash this
    }

    const saved = await user.save();
    const { password, ...result } = saved.toObject();
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('المستخدم غير موجود');
    }
  }

  // We only need to create an initial admin if none exists. No public registration.
  async seedAdminIfNoneExists(): Promise<void> {
    const adminCount = await this.userModel
      .countDocuments({ role: 'admin' })
      .exec();
    if (adminCount > 0) {
      return;
    }

    // كلمة مرور ثابتة في الشيفرة تعني أن كل نشر للمشروع يبدأ ببيانات دخول معروفة
    const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;
    if (!initialPassword) {
      this.logger.warn(
        'لم يُنشأ حساب المدير الأول: عرّف INITIAL_ADMIN_PASSWORD في ملف .env ثم أعد التشغيل',
      );
      return;
    }

    await this.userModel.create({
      name: 'مدير النظام الأساسي',
      username: process.env.INITIAL_ADMIN_USERNAME ?? 'admin',
      password: initialPassword, // The pre-save hook will hash this
      role: 'admin',
    });
    // لا تُطبع كلمة المرور — السجلات تُقرأ وتُؤرشف وتُشارك
    this.logger.log(
      'تم إنشاء حساب المدير الأول بكلمة المرور المعرّفة في البيئة',
    );
  }
}
