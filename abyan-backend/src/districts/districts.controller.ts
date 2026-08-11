import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { CreateDistrictRegionDto } from './dto/create-district-region.dto';
import { UpdateDistrictRegionDto } from './dto/update-district-region.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  // --- Public Endpoints ---

  @UseInterceptors(CacheInterceptor)
  @Get('frontend')
  async getFrontendData() {
    return this.districtsService.findAllForFrontend();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('frontend/regions')
  async getFrontendRegions() {
    return this.districtsService.findAllRegionsForFrontend();
  }

  // --- Protected District Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post()
  async createDistrict(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.createDistrict(createDistrictDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get()
  async findAllDistricts() {
    return this.districtsService.findAllDistricts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put(':id')
  async updateDistrict(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtsService.updateDistrict(id, updateDistrictDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete districts
  @Delete(':id')
  async deleteDistrict(@Param('id') id: string) {
    return this.districtsService.deleteDistrict(id);
  }

  // --- Protected District Region Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('regions')
  async findAllRegions() {
    return this.districtsService.findAllRegions();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('regions')
  async createRegion(@Body() createDistrictRegionDto: CreateDistrictRegionDto) {
    return this.districtsService.createRegion(createDistrictRegionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('regions/:id')
  async updateRegion(
    @Param('id') id: string,
    @Body() updateDistrictRegionDto: UpdateDistrictRegionDto,
  ) {
    return this.districtsService.updateRegion(id, updateDistrictRegionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete regions
  @Delete('regions/:id')
  async deleteRegion(@Param('id') id: string) {
    return this.districtsService.deleteRegion(id);
  }
}
