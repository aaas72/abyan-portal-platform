import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ArchiveItem,
  ArchiveItemDocument,
} from './schemas/archive-item.schema';
import {
  ArchiveCategory,
  ArchiveCategoryDocument,
} from './schemas/archive-category.schema';
import { CreateArchiveItemDto } from './dto/create-archive-item.dto';
import { UpdateArchiveItemDto } from './dto/update-archive-item.dto';
import { CreateArchiveCategoryDto } from './dto/create-archive-category.dto';
import { UpdateArchiveCategoryDto } from './dto/update-archive-category.dto';
import { MediaMapper } from '../utils/media.mapper';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(ArchiveItem.name)
    private archiveModel: Model<ArchiveItemDocument>,
    @InjectModel(ArchiveCategory.name)
    private categoryModel: Model<ArchiveCategoryDocument>,
  ) {}

  // --- Frontend Aggregation (Public) ---

  async findAllForFrontend() {
    const archives = await this.archiveModel.find().lean().limit(100).exec();

    const result = archives.map((archive) => ({
      id: archive._id.toString(),
      category: archive.category,
      categoryLabel: archive.categoryLabel,
      title: archive.title,
      year: archive.year,
      location: archive.location,
      aspectRatio: archive.aspectRatio,
      bgGradient: archive.bgGradient,
      description: archive.description,
      images: MediaMapper.extractImages(archive),
    }));

    return result;
  }

  // --- ArchiveItem Management (Protected) ---

  async createArchiveItem(
    createArchiveItemDto: CreateArchiveItemDto,
  ): Promise<ArchiveItem> {
    const newItem = new this.archiveModel(createArchiveItemDto);
    return newItem.save();
  }

  async updateArchiveItem(
    id: string,
    updateArchiveItemDto: UpdateArchiveItemDto,
  ): Promise<ArchiveItem> {
    const updated = await this.archiveModel
      .findByIdAndUpdate(id, updateArchiveItemDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Ø¹Ù†ØµØ± Ø§Ù„Ø£Ø±Ø´ÙŠÙ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯');
    return updated;
  }

  async deleteArchiveItem(id: string): Promise<void> {
    const result = await this.archiveModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Ø¹Ù†ØµØ± Ø§Ù„Ø£Ø±Ø´ÙŠÙ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯');
  }

  async findAllArchiveItems(): Promise<ArchiveItem[]> {
    return this.archiveModel.find().limit(100).lean().exec();
  }

  // --- ArchiveCategory Management ---

  async createCategory(
    createArchiveCategoryDto: CreateArchiveCategoryDto,
  ): Promise<ArchiveCategory> {
    const newCategory = new this.categoryModel(createArchiveCategoryDto);
    return newCategory.save();
  }

  async updateCategory(
    id: string,
    updateArchiveCategoryDto: UpdateArchiveCategoryDto,
  ): Promise<ArchiveCategory> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateArchiveCategoryDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('ØªØµÙ†ÙŠÙ Ø§Ù„Ø£Ø±Ø´ÙŠÙ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯');
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('ØªØµÙ†ÙŠÙ Ø§Ù„Ø£Ø±Ø´ÙŠÙ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯');
  }

  async findAllCategories(): Promise<ArchiveCategory[]> {
    return this.categoryModel.find().limit(100).lean().exec();
  }
}

