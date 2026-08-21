import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { TermsService } from './terms.service';
import { UpdateTermsDto } from './dto/update-terms.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  // Public frontend endpoint
  @Get('frontend')
  async getFrontendContent() {
    return this.termsService.getTermsContent();
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAdminContent() {
    return this.termsService.getTermsContent();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put()
  async updateTerms(@Body() updateDto: UpdateTermsDto) {
    return this.termsService.updateTermsContent(updateDto);
  }
}
