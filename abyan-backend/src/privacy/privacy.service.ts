import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivacyContent } from './schemas/privacy.schema';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';

@Injectable()
export class PrivacyService {
  constructor(
    @InjectModel(PrivacyContent.name)
    private readonly privacyModel: Model<PrivacyContent>,
  ) {}

  async getPrivacyContent(): Promise<PrivacyContent> {
    let content = await this.privacyModel.findOne().lean().exec();
    if (!content) {
      content = await this.privacyModel.create({
        intro: [],
        dataCollection: [],
        usageAndProtection: [],
        cookiesAndAnalytics: [],
      });
    }
    return content as PrivacyContent;
  }

  async updatePrivacyContent(updateDto: UpdatePrivacyDto): Promise<PrivacyContent> {
    const updated = await this.privacyModel
      .findOneAndUpdate(
        {},
        { $set: updateDto },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return updated;
  }
}
