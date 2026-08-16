import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LandmarksService } from './landmarks.service';
import { CreateLandmarkCategoryDto } from './dto/create-landmark-category.dto';
import { UpdateLandmarkCategoryDto } from './dto/update-landmark-category.dto';
import { CreateLandmarkPhotoCardDto } from './dto/create-landmark-photo-card.dto';
import { UpdateLandmarkPhotoCardDto } from './dto/update-landmark-photo-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('landmarks')
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}

  // --- Public Endpoints ---

  @Get('frontend')
  async getFrontendData(@Query('district') district?: string) {
    return this.landmarksService.findAllForFrontend(district);
  }

  // --- Protected Category Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateLandmarkCategoryDto) {
    return this.landmarksService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('categories')
  async findAllCategories() {
    return this.landmarksService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateLandmarkCategoryDto,
  ) {
    return this.landmarksService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete categories
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.landmarksService.deleteCategory(id);
  }

  // --- Protected PhotoCard Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('photo-cards')
  async createPhotoCard(
    @Body() createPhotoCardDto: CreateLandmarkPhotoCardDto,
  ) {
    return this.landmarksService.createPhotoCard(createPhotoCardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('photo-cards')
  async findAllPhotoCards() {
    return this.landmarksService.findAllPhotoCards();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('photo-cards/:id')
  async updatePhotoCard(
    @Param('id') id: string,
    @Body() updatePhotoCardDto: UpdateLandmarkPhotoCardDto,
  ) {
    return this.landmarksService.updatePhotoCard(id, updatePhotoCardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete photo cards
  @Delete('photo-cards/:id')
  async deletePhotoCard(@Param('id') id: string) {
    return this.landmarksService.deletePhotoCard(id);
  }
}
