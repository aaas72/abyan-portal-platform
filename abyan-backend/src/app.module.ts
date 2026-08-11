import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.interface';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PioneersModule } from './pioneers/pioneers.module';
import { LandmarksModule } from './landmarks/landmarks.module';
import { CultureModule } from './culture/culture.module';
import { EconomyModule } from './economy/economy.module';
import { DistrictsModule } from './districts/districts.module';
import { HistoryModule } from './history/history.module';
import { GalleryModule } from './gallery/gallery.module';
import { HighlightsModule } from './highlights/highlights.module';
import { AboutModule } from './about/about.module';
import { CopyrightModule } from './copyright/copyright.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LogsModule } from './logs/logs.module';
import { HealthModule } from './health/health.module';
import { UploadModule } from './upload/upload.module';
import { ContactModule } from './contact/contact.module';
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        MONGODB_URI: Joi.string().required(),
        // 32 حرفاً كحد أدنى: مفتاح قصير قابل للتخمين يعني رموز مدير مزوّرة
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('7d'),
        // اختياري: يُستخدم مرة واحدة لإنشاء حساب المدير الأول فقط
        INITIAL_ADMIN_USERNAME: Joi.string().optional(),
        INITIAL_ADMIN_PASSWORD: Joi.string().min(12).optional(),
      }),
    }),

    // Database Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        uri: configService.get<string>('MONGODB_URI', { infer: true }),
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting (Security)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // Max 100 requests per minute per IP
      },
    ]),

    // Caching
    CacheModule.register({
      ttl: 60000, // 60 seconds
      isGlobal: true,
    }),

    // Authentication
    AuthModule,

    // Users
    UsersModule,

    // Features
    UploadModule,
    PioneersModule,
    LandmarksModule,
    CultureModule,
    EconomyModule,
    DistrictsModule,
    HistoryModule,
    GalleryModule,
    HighlightsModule,
    AboutModule,
    CopyrightModule,
    AnalyticsModule,
    LogsModule,
    HealthModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
