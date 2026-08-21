import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  // Public frontend endpoint
  @Get('frontend')
  async getFrontendContent() {
    return this.privacyService.getPrivacyContent();
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAdminContent() {
    return this.privacyService.getPrivacyContent();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put()
  async updatePrivacy(@Body() updateDto: UpdatePrivacyDto) {
    return this.privacyService.updatePrivacyContent(updateDto);
  }
}
