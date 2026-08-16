import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HighlightsService } from './highlights.service';
import { CreateHighlightItemDto } from './dto/create-highlight-item.dto';
import { UpdateHighlightItemDto } from './dto/update-highlight-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('highlights')
export class HighlightsController {
  constructor(private readonly highlightsService: HighlightsService) {}

  // --- Public Endpoints ---

  @Get('frontend')
  async getFrontendData() {
    return this.highlightsService.findAllForFrontend();
  }

  // --- Protected Highlight Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post()
  async createHighlight(
    @Body() createHighlightItemDto: CreateHighlightItemDto,
  ) {
    return this.highlightsService.createHighlight(createHighlightItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get()
  async findAllHighlights() {
    return this.highlightsService.findAllHighlights();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put(':id')
  async updateHighlight(
    @Param('id') id: string,
    @Body() updateHighlightItemDto: UpdateHighlightItemDto,
  ) {
    return this.highlightsService.updateHighlight(id, updateHighlightItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteHighlight(@Param('id') id: string) {
    return this.highlightsService.deleteHighlight(id);
  }

  // --- Landing Sections Endpoints ---

  @Get('sections/frontend')
  async getFrontendLandingSections() {
    return this.highlightsService.findFrontendLandingSections();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('sections/all')
  async findAllLandingSections() {
    return this.highlightsService.findAllLandingSections();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('sections')
  async createLandingSection(@Body() createLandingSectionDto: any) {
    return this.highlightsService.createLandingSection(createLandingSectionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('sections/:id')
  async updateLandingSection(
    @Param('id') id: string,
    @Body() updateLandingSectionDto: any,
  ) {
    return this.highlightsService.updateLandingSection(
      id,
      updateLandingSectionDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('sections/:id')
  async deleteLandingSection(@Param('id') id: string) {
    return this.highlightsService.deleteLandingSection(id);
  }
}
