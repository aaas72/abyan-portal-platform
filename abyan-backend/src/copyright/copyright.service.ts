import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CopyrightContent } from './schemas/copyright.schema';
import { UpdateCopyrightContentDto } from './dto/update-copyright.dto';

@Injectable()
export class CopyrightService {
  constructor(
    @InjectModel(CopyrightContent.name)
    private copyrightModel: Model<CopyrightContent>,
  ) {}

  async getCopyrightContent(): Promise<CopyrightContent> {
    let content = await this.copyrightModel.findOne().lean().exec();
    if (!content) {
      content = await this.copyrightModel.create({
        declarations: [],
        pillars: [],
        guidelines: [],
        contactNotice: [],
      });
    }
    return content;
  }

  async updateCopyrightContent(
    updateDto: UpdateCopyrightContentDto,
  ): Promise<CopyrightContent> {
    const updated = await this.copyrightModel
      .findOneAndUpdate(
        {},
        { $set: updateDto },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return updated;
  }
}
