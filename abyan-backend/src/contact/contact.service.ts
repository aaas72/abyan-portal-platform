import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactInfo, ContactInfoDocument } from './schemas/contact.schema';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactInfo.name)
    private readonly contactInfoModel: Model<ContactInfoDocument>,
  ) {}

  // Get singleton document (create if missing)
  async getContactInfo(): Promise<ContactInfo> {
    let contact = await this.contactInfoModel.findOne().lean().exec();
    if (!contact) {
      contact = await this.contactInfoModel.create({
        emails: [],
        phones: [],
      });
    }
    return contact;
  }

  // Update the singleton document
  async updateContactInfo(updateDto: UpdateContactDto): Promise<ContactInfo> {
    const updated = await this.contactInfoModel
      .findOneAndUpdate(
        {},
        { $set: updateDto },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return updated;
  }
}
