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
import { HistoryService } from './history.service';
import { CreateHistoryEraDto } from './dto/create-history-era.dto';
import { UpdateHistoryEraDto } from './dto/update-history-era.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // --- Public Endpoints ---

  @Get('frontend')
  async getFrontendData() {
    return this.historyService.findAllForFrontend();
  }

  // --- Protected HistoryEra Endpoints ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Post('eras')
  async createEra(@Body() createHistoryEraDto: CreateHistoryEraDto) {
    return this.historyService.createEra(createHistoryEraDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Get('eras')
  async findAllEras() {
    return this.historyService.findAllEras();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'writer')
  @Put('eras/:id')
  async updateEra(
    @Param('id') id: string,
    @Body() updateHistoryEraDto: UpdateHistoryEraDto,
  ) {
    return this.historyService.updateEra(id, updateHistoryEraDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete eras
  @Delete('eras/:id')
  async deleteEra(@Param('id') id: string) {
    return this.historyService.deleteEra(id);
  }
}
