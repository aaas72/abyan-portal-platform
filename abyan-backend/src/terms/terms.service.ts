import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TermsContent } from './schemas/terms.schema';
import { UpdateTermsDto } from './dto/update-terms.dto';

@Injectable()
export class TermsService {
  constructor(
    @InjectModel(TermsContent.name)
    private readonly termsModel: Model<TermsContent>,
  ) {}

  async getTermsContent(): Promise<TermsContent> {
    let content = await this.termsModel.findOne().lean().exec();
    if (!content) {
      content = await this.termsModel.create({
        intro: [],
        usageRules: [],
        intellectualProperty: [],
        disclaimer: [],
      });
    }
    return content as TermsContent;
  }

  async updateTermsContent(updateDto: UpdateTermsDto): Promise<TermsContent> {
    const updated = await this.termsModel
      .findOneAndUpdate(
        {},
        { $set: updateDto },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return updated;
  }
}
