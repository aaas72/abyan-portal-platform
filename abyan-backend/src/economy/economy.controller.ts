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
import { EconomyService } from './economy.service';
import { CreateEconomyPillarDto } from './dto/create-economy-pillar.dto';
import { UpdateEconomyPillarDto } from './dto/update-economy-pillar.dto';
import { CreateEconomyPhotoCardDto } from './dto/create-economy-photo-card.dto';
import { UpdateEconomyPhotoCardDto } from './dto/update-economy-photo-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('economy')
export class EconomyController {
  constructor(private readonly economyService: EconomyService) {}

  // --- Public Endpoints ---

  @Get('frontend')
  async getFrontendData(@Query('district') district?: string) {
    return this.economyService.findAllForFrontend(district);
  }

  // --- Protected Pillar Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('pillars')
  async createPillar(@Body() createPillarDto: CreateEconomyPillarDto) {
    return this.economyService.createPillar(createPillarDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('pillars')
  async findAllPillars() {
    return this.economyService.findAllPillars();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('pillars/:id')
  async updatePillar(
    @Param('id') id: string,
    @Body() updatePillarDto: UpdateEconomyPillarDto,
  ) {
    return this.economyService.updatePillar(id, updatePillarDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete pillars
  @Delete('pillars/:id')
  async deletePillar(@Param('id') id: string) {
    return this.economyService.deletePillar(id);
  }

  // --- Protected PhotoCard Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('photo-cards')
  async createPhotoCard(@Body() createPhotoCardDto: CreateEconomyPhotoCardDto) {
    return this.economyService.createPhotoCard(createPhotoCardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('photo-cards')
  async findAllPhotoCards() {
    return this.economyService.findAllPhotoCards();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('photo-cards/:id')
  async updatePhotoCard(
    @Param('id') id: string,
    @Body() updatePhotoCardDto: UpdateEconomyPhotoCardDto,
  ) {
    return this.economyService.updatePhotoCard(id, updatePhotoCardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete photo cards
  @Delete('photo-cards/:id')
  async deletePhotoCard(@Param('id') id: string) {
    return this.economyService.deletePhotoCard(id);
  }
}
