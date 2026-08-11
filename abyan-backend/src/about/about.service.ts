import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AboutContent } from './schemas/about.schema';
import { UpdateAboutContentDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(AboutContent.name) private aboutModel: Model<AboutContent>,
  ) {}

  async getAboutContent(): Promise<AboutContent> {
    let content = await this.aboutModel.findOne().lean().exec();
    if (!content) {
      content = await this.aboutModel.create({
        pillars: [],
        values: [],
        scopes: [],
        stats: [],
      });
    }
    return content;
  }

  async updateAboutContent(
    updateDto: UpdateAboutContentDto,
  ): Promise<AboutContent> {
    const updated = await this.aboutModel
      .findOneAndUpdate(
        {},
        { $set: updateDto },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return updated;
  }
}
