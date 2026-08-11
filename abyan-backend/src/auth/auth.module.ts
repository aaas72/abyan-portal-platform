import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          // بلا قيمة احتياطية: مفتاح منشور في الشيفرة يسمح بتزوير رموز المدراء
          throw new Error('JWT_SECRET مطلوب — عرّفه في ملف .env');
        }
        return {
          secret,
          signOptions: {
            // القيمة مُتحقَّق منها كنص في مخطط Joi ضمن AppModule
            expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
              '7d') as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
