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
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CultureService } from './culture.service';
import { CreateCultureCategoryDto } from './dto/create-culture-category.dto';
import { UpdateCultureCategoryDto } from './dto/update-culture-category.dto';
import { CreateCultureItemDto } from './dto/create-culture-item.dto';
import { UpdateCultureItemDto } from './dto/update-culture-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('culture')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  // --- Public Endpoints ---

  @UseInterceptors(CacheInterceptor)
  @Get('frontend')
  async getFrontendData(@Query('district') district?: string) {
    return this.cultureService.findAllForFrontend(district);
  }

  // --- Protected Category Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateCultureCategoryDto) {
    return this.cultureService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('categories')
  async findAllCategories() {
    return this.cultureService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCultureCategoryDto,
  ) {
    return this.cultureService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete categories
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.cultureService.deleteCategory(id);
  }

  // --- Protected FoodCard Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('food-cards')
  async createItem(@Body() createItemDto: CreateCultureItemDto) {
    return this.cultureService.createItem(createItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('food-cards')
  async findAllItems() {
    return this.cultureService.findAllItems();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('food-cards/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateCultureItemDto,
  ) {
    return this.cultureService.updateItem(id, updateItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete food cards
  @Delete('food-cards/:id')
  async deleteItem(@Param('id') id: string) {
    return this.cultureService.deleteItem(id);
  }
}
