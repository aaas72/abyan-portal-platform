import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HighlightItem,
  HighlightItemDocument,
} from './schemas/highlight-item.schema';
import {
  LandingSection,
  LandingSectionDocument,
} from './schemas/landing-section.schema';
import { CreateHighlightItemDto } from './dto/create-highlight-item.dto';
import { UpdateHighlightItemDto } from './dto/update-highlight-item.dto';

@Injectable()
export class HighlightsService {
  constructor(
    @InjectModel(HighlightItem.name)
    private highlightModel: Model<HighlightItemDocument>,
    @InjectModel(LandingSection.name)
    private landingSectionModel: Model<LandingSectionDocument>,
  ) {}

  // --- Frontend Aggregation (Public) ---

  async findAllForFrontend() {
    const highlights = await this.highlightModel.find().lean().limit(100).exec();

    const result = highlights.map((highlight) => ({
      id: highlight._id.toString(),
      title: highlight.title,
      category: highlight.category,
      description: highlight.description,
      linkText: highlight.linkText,
      href: highlight.href,
    }));

    return result;
  }

  // --- HighlightItem Management (Protected) ---

  async createHighlight(
    createHighlightItemDto: CreateHighlightItemDto,
  ): Promise<HighlightItem> {
    const newItem = new this.highlightModel(createHighlightItemDto);
    return newItem.save();
  }

  async updateHighlight(
    id: string,
    updateHighlightItemDto: UpdateHighlightItemDto,
  ): Promise<HighlightItem> {
    const updated = await this.highlightModel
      .findByIdAndUpdate(id, updateHighlightItemDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('المقتطف غير موجود');
    return updated;
  }

  async deleteHighlight(id: string): Promise<void> {
    const result = await this.highlightModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('المقتطف غير موجود');
  }

  async findAllHighlights(): Promise<HighlightItem[]> {
    return this.highlightModel.find().limit(100).lean().exec();
  }

  // --- Landing Sections Management ---

  async findFrontendLandingSections() {
    return this.landingSectionModel.find({ isActive: true }).lean().limit(100).exec();
  }

  async findAllLandingSections() {
    return this.landingSectionModel.find().limit(100).lean().exec();
  }

  async createLandingSection(createLandingSectionDto: any) {
    const newSection = new this.landingSectionModel(createLandingSectionDto);
    return newSection.save();
  }

  async updateLandingSection(id: string, updateLandingSectionDto: any) {
    const updated = await this.landingSectionModel
      .findByIdAndUpdate(id, updateLandingSectionDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('القسم غير موجود');
    return updated;
  }

  async deleteLandingSection(id: string): Promise<void> {
    const result = await this.landingSectionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('القسم غير موجود');
  }
}
