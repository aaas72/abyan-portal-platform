import { Controller, Get, Put, Body, UseGuards, UseInterceptors, Inject } from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AboutService } from './about.service';
import { UpdateAboutContentDto } from './dto/update-about.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('about')
export class AboutController {
  constructor(
    private readonly aboutService: AboutService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Public frontend endpoint
  @UseInterceptors(CacheInterceptor)
  @Get('frontend')
  async getFrontendContent() {
    const content = await this.aboutService.getAboutContent();
    return content;
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAdminContent() {
    return this.aboutService.getAboutContent();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put()
  async updateContent(@Body() updateDto: UpdateAboutContentDto) {
    const res = await this.aboutService.updateAboutContent(updateDto);
    await this.cacheManager.clear();
    return res;
  }
}
