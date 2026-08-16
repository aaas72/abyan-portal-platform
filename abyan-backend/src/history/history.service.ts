import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryEra, HistoryEraDocument } from './schemas/history-era.schema';
import { CreateHistoryEraDto } from './dto/create-history-era.dto';
import { UpdateHistoryEraDto } from './dto/update-history-era.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(HistoryEra.name) private eraModel: Model<HistoryEraDocument>,
  ) {}

  // --- Frontend Aggregation (Public) ---

  async findAllForFrontend() {
    const eras = await this.eraModel.find({ isActive: true }).lean().limit(100).exec();

    const result = eras.map((era) => ({
      id: era._id.toString(),
      startYear:
        era.startYear || (era as any).timeframe?.split('-')[0]?.trim() || '',
      endYear:
        era.endYear || (era as any).timeframe?.split('-')[1]?.trim() || '',
      eraTitle: era.eraTitle,
      historicalCapital: era.historicalCapital,
      shortSummary: era.shortSummary,
      fullDescription: era.fullDescription,
      authorName: era.authorName || 'فريق توثيق بوابة أبين',
      sourceName: (era as any).sourceName || '',
      sourceUrl: (era as any).sourceUrl || '',
      sources: (era as any).sources || ((era as any).sourceName ? [{ name: (era as any).sourceName, url: (era as any).sourceUrl }] : []),
      keyEvents: era.keyEvents,
      notableLandmarks: era.notableLandmarks,
    }));

    return result;
  }

  // --- HistoryEra Management (Protected) ---

  async createEra(createEraDto: CreateHistoryEraDto): Promise<HistoryEra> {
    const newEra = new this.eraModel({
      ...createEraDto,
      authorName: createEraDto.authorName?.trim() || 'فريق توثيق بوابة أبين',
    });
    return newEra.save();
  }

  async updateEra(
    id: string,
    updateEraDto: UpdateHistoryEraDto,
  ): Promise<HistoryEra> {
    const updated = await this.eraModel
      .findByIdAndUpdate(id, updateEraDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('الحقبة التاريخية غير موجودة');
    return updated;
  }

  async deleteEra(id: string): Promise<void> {
    const result = await this.eraModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('الحقبة التاريخية غير موجودة');
  }

  async findAllEras(): Promise<HistoryEra[]> {
    return this.eraModel.find().limit(100).lean().exec();
  }
}
