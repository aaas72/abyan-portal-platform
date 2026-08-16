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
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CultureService {
  constructor(
    @InjectModel(CultureCategory.name)
    private categoryModel: Model<CultureCategoryDocument>,
    @InjectModel(CultureItem.name)
    private itemModel: Model<CultureItemDocument>,
    private uploadService: UploadService,
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
    if (!updated) throw new NotFoundException('Ù Ø¦Ø© Ø§Ù„Ù…ÙˆØ±ÙˆØ« Ø§Ù„Ø´Ø¹Ø¨ÙŠ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('فئة الموروث الشعبي غير موجودة');
    
    // Find associated items to delete their media
    const itemsToDelete = await this.itemModel.find({ category: id }).exec();
    for (const item of itemsToDelete) {
      if (item.images && item.images.length > 0) {
        await this.uploadService.deleteMultipleMedia(item.images, 'image');
      }
    }
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
    const savedItem = await newItem.save();

    let mediaUpdated = false;
    if (savedItem.images && savedItem.images.length > 0) {
      savedItem.images = await this.uploadService.renameMediaUrls(
        savedItem._id.toString(),
        savedItem.title,
        savedItem.images,
        'culture',
        'image',
      );
      mediaUpdated = true;
    }

    if (mediaUpdated) {
      return savedItem.save();
    }
    return savedItem;
  }

  async updateItem(
    id: string,
    updateItemDto: UpdateCultureItemDto,
  ): Promise<CultureItem> {
    const existingItem = await this.itemModel.findById(id).exec();
    if (!existingItem) throw new NotFoundException(`Item #${id} not found`);

    // Clean up removed images
    if (updateItemDto.images && existingItem.images) {
      const removedImages = existingItem.images.filter(img => !updateItemDto.images?.includes(img));
      if (removedImages.length > 0) {
        await this.uploadService.deleteMultipleMedia(removedImages, 'image');
      }
    }

    if (updateItemDto.images && updateItemDto.images.length > 0) {
      updateItemDto.images = await this.uploadService.renameMediaUrls(
        id,
        updateItemDto.title || existingItem.title,
        updateItemDto.images,
        'culture',
        'image',
      );
    }

    const updated = await this.itemModel
      .findByIdAndUpdate(id, updateItemDto, { new: true })
      .exec();
    return updated!;
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
    const existingItem = await this.itemModel.findById(id).exec();
    if (!existingItem) throw new NotFoundException(`Item #${id} not found`);

    if (existingItem.images && existingItem.images.length > 0) {
      await this.uploadService.deleteMultipleMedia(existingItem.images, 'image');
    }

    await this.itemModel.findByIdAndDelete(id).exec();
  }
}

