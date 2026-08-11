import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TrackVisitDto } from './dto/track-visit.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackVisit(@Body() trackDto: TrackVisitDto, @Req() req: Request) {
    const { section, entityId, entityName } = trackDto;

    // Get IP from request. Handles reverse proxies (e.g. Nginx) if configured
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Extract first IP if it's a list
    const clientIp = Array.isArray(ip)
      ? ip[0]
      : typeof ip === 'string'
        ? ip.split(',')[0]
        : ip;

    // Run in background (don't await) to respond fast
    this.analyticsService
      .trackVisit(section, clientIp as string, entityId, entityName)
      .catch((e) => console.error(e));

    return { success: true };
  }

  // ملاحظة: @Roles وحده لا يحمي شيئاً — التنفيذ الفعلي يتم عبر RolesGuard،
  // ولا بد من @UseGuards ما دام الحارس غير مسجّل عالمياً في AppModule.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can see stats
  @Get('stats')
  async getStats() {
    return await this.analyticsService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can see top entities
  @Get('top-entities')
  async getTopEntities() {
    return await this.analyticsService.getTopEntities(10);
  }
}
