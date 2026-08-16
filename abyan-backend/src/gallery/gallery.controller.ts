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
import { GalleryService } from './gallery.service';
import { CreateArchiveItemDto } from './dto/create-archive-item.dto';
import { UpdateArchiveItemDto } from './dto/update-archive-item.dto';
import { CreateArchiveCategoryDto } from './dto/create-archive-category.dto';
import { UpdateArchiveCategoryDto } from './dto/update-archive-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // --- Public Endpoints ---

  @Get('frontend')
  async getFrontendData() {
    return this.galleryService.findAllForFrontend();
  }

  // --- Protected ArchiveItem Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post()
  async createArchiveItem(@Body() createArchiveItemDto: CreateArchiveItemDto) {
    return this.galleryService.createArchiveItem(createArchiveItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get()
  async findAllArchiveItems() {
    return this.galleryService.findAllArchiveItems();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put(':id')
  async updateArchiveItem(
    @Param('id') id: string,
    @Body() updateArchiveItemDto: UpdateArchiveItemDto,
  ) {
    return this.galleryService.updateArchiveItem(id, updateArchiveItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete
  @Delete(':id')
  async deleteArchiveItem(@Param('id') id: string) {
    return this.galleryService.deleteArchiveItem(id);
  }

  // --- ArchiveCategory Endpoints ---

  @Get('categories')
  async findAllCategories() {
    return this.galleryService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateArchiveCategoryDto) {
    return this.galleryService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateArchiveCategoryDto,
  ) {
    return this.galleryService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.galleryService.deleteCategory(id);
  }
}
