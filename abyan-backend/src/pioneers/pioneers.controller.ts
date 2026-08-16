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
import { PioneersService } from './pioneers.service';
import { CreatePioneerCategoryDto } from './dto/create-pioneer-category.dto';
import { UpdatePioneerCategoryDto } from './dto/update-pioneer-category.dto';
import { CreatePioneerFigureDto } from './dto/create-pioneer-figure.dto';
import { UpdatePioneerFigureDto } from './dto/update-pioneer-figure.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pioneers')
export class PioneersController {
  constructor(private readonly pioneersService: PioneersService) {}

  // --- Public Endpoints ---

  @Get('frontend')
  async getFrontendData(@Query('district') district?: string) {
    return this.pioneersService.findAllForFrontend(district);
  }

  // --- Protected Category Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreatePioneerCategoryDto) {
    return this.pioneersService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('categories')
  async findAllCategories() {
    return this.pioneersService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdatePioneerCategoryDto,
  ) {
    return this.pioneersService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete categories
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.pioneersService.deleteCategory(id);
  }

  // --- Protected Figure Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('figures')
  async createFigure(@Body() createFigureDto: CreatePioneerFigureDto) {
    return this.pioneersService.createFigure(createFigureDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('figures')
  async findAllFigures() {
    return this.pioneersService.findAllFigures();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('figures/:id')
  async updateFigure(
    @Param('id') id: string,
    @Body() updateFigureDto: UpdatePioneerFigureDto,
  ) {
    return this.pioneersService.updateFigure(id, updateFigureDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete figures
  @Delete('figures/:id')
  async deleteFigure(@Param('id') id: string) {
    return this.pioneersService.deleteFigure(id);
  }
}
