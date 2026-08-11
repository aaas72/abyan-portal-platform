import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CultureCategory,
  CultureCategoryDocument,
} from './schemas/culture-category.schema';
import {
  CultureItem,
  CultureItemDocument,
} from './schemas/culture-item.schema';
import { CreateCultureCategoryDto } from './dto/create-culture-category.dto';
import { UpdateCultureCategoryDto } from './dto/update-culture-category.dto';
import { CreateCultureItemDto } from './dto/create-culture-item.dto';
import { UpdateCultureItemDto } from './dto/update-culture-item.dto';
import { MediaMapper } from '../utils/media.mapper';

@Injectable()
export class CultureService {
  constructor(
    @InjectModel(CultureCategory.name)
    private categoryModel: Model<CultureCategoryDocument>,
    @InjectModel(CultureItem.name)
    private itemModel: Model<CultureItemDocument>,
  ) {}

  // --- Frontend Aggregation (Public) ---

  async findAllForFrontend(district?: string) {
    const categories = await this.categoryModel.find().lean().limit(100).exec();
    const photoQuery = district ? { location: district } : {};
    const items = await this.itemModel.find(photoQuery).lean().limit(100).exec();

    const result = categories.map((cat) => {
      const catItems = items.filter(
        (item) => item.category.toString() === cat._id.toString(),
      );

      return {
        id: cat._id.toString(),
        categoryName: cat.categoryName,
        title: cat.title,
        subtitle: cat.subtitle,
        description: cat.description,
        primaryTags: cat.primaryTags,
        details: cat.details,
        audioTrack: cat.audioTrack
          ? {
              title: cat.audioTrack.title,
              artist: cat.audioTrack.artist,
              category: cat.audioTrack.category,
              duration: cat.audioTrack.duration,
              lyricsExcerpt: cat.audioTrack.lyricsExcerpt,
            }
          : undefined,
        visualShowcase: cat.visualShowcase
          ? {
              title: cat.visualShowcase.title,
              tag: cat.visualShowcase.tag,
              description: cat.visualShowcase.description,
              bgGradient: cat.visualShowcase.bgGradient,
            }
          : undefined,
        items: catItems.map((f) => ({
          id: f._id.toString(),
          title: f.title,
          tag: f.tag,
          location: f.location,
          description: f.description,
          bgGradient: f.bgGradient,
          images: MediaMapper.extractImages(f),
        })),
      };
    });

    return result;
  }

  // --- Category Management (Protected) ---

  async createCategory(
    createCategoryDto: CreateCultureCategoryDto,
  ): Promise<CultureCategory> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCultureCategoryDto,
  ): Promise<CultureCategory> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('ÙØ¦Ø© Ø§Ù„Ù…ÙˆØ±ÙˆØ« Ø§Ù„Ø´Ø¹Ø¨ÙŠ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('ÙØ¦Ø© Ø§Ù„Ù…ÙˆØ±ÙˆØ« Ø§Ù„Ø´Ø¹Ø¨ÙŠ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
    // Also delete associated items
    await this.itemModel.deleteMany({ category: id }).exec();
  }

  async findAllCategories(): Promise<CultureCategory[]> {
    return this.categoryModel.find().limit(100).lean().exec();
  }

  // --- Items ---

  async createItem(
    createItemDto: CreateCultureItemDto,
  ): Promise<CultureItem> {
    const newItem = new this.itemModel(createItemDto);
    return newItem.save();
  }

  async updateItem(
    id: string,
    updateItemDto: UpdateCultureItemDto,
  ): Promise<CultureItem> {
    const updated = await this.itemModel
      .findByIdAndUpdate(id, updateItemDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Item #${id} not found`);
    }
    return updated;
  }

  async findAllItems(): Promise<CultureItem[]> {
    const items = await this.itemModel
      .find()
      .populate('category', 'categoryName title')
      .limit(500)
      .lean()
      .exec();
      
    return items.map((item: any) => ({
      ...item,
      images: MediaMapper.extractImages(item),
    }));
  }
  
  async deleteItem(id: string): Promise<void> {
    const result = await this.itemModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Item #${id} not found`);
  }
}

