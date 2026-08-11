import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Frontend public endpoint
  @Get('frontend')
  async getContactInfoPublic() {
    return this.contactService.getContactInfo();
  }

  // Admin GET endpoint
  @UseGuards(JwtAuthGuard)
  @Get()
  async getContactInfo() {
    return this.contactService.getContactInfo();
  }

  // Admin PUT endpoint
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateContactInfo(@Body() updateDto: UpdateContactDto) {
    return this.contactService.updateContactInfo(updateDto);
  }
}
  