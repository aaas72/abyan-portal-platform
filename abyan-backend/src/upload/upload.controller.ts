import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 100 * 1024 * 1024, // 100 MB Global Limit to prevent memory exhaustion
    },
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('لم يتم إرفاق أي ملف.');
    }

    const { mimetype, size } = file;
    
    // Limits
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
    const MAX_AUDIO_SIZE = 30 * 1024 * 1024; // 30MB

    if (mimetype.startsWith('image/')) {
      if (size > MAX_IMAGE_SIZE) {
        throw new BadRequestException('حجم الصورة يتجاوز الحد المسموح (10 ميجابايت).');
      }
    } else if (mimetype.startsWith('video/')) {
      if (size > MAX_VIDEO_SIZE) {
        throw new BadRequestException('حجم الفيديو يتجاوز الحد المسموح (100 ميجابايت).');
      }
    } else if (mimetype.startsWith('audio/')) {
      if (size > MAX_AUDIO_SIZE) {
        throw new BadRequestException('حجم الملف الصوتي يتجاوز الحد المسموح (30 ميجابايت).');
      }
    } else {
      throw new BadRequestException('نوع الملف غير مدعوم. المنصة تقبل فقط الصور والفيديوهات والملفات الصوتية.');
    }

    const url = await this.uploadService.uploadFile(file, folder);
    return { url };
  }
}
