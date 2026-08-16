import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { CopyrightService } from './copyright.service';
import { UpdateCopyrightContentDto } from './dto/update-copyright.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('copyright')
export class CopyrightController {
  constructor(
    private readonly copyrightService: CopyrightService,
  ) {}

  // Public frontend endpoint
  @Get('frontend')
  async getFrontendContent() {
    const content = await this.copyrightService.getCopyrightContent();
    return content;
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAdminContent() {
    return this.copyrightService.getCopyrightContent();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put()
  async updateContent(@Body() updateDto: UpdateCopyrightContentDto) {
    const res = await this.copyrightService.updateCopyrightContent(updateDto);
    return res;
  }
}
