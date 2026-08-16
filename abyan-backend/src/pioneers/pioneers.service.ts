import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PioneerCategory,
  PioneerCategoryDocument,
} from './schemas/pioneer-category.schema';
import {
  PioneerFigure,
  PioneerFigureDocument,
} from './schemas/pioneer-figure.schema';
import { CreatePioneerCategoryDto } from './dto/create-pioneer-category.dto';
import { UpdatePioneerCategoryDto } from './dto/update-pioneer-category.dto';
import { MediaMapper } from '../utils/media.mapper';
import { CreatePioneerFigureDto } from './dto/create-pioneer-figure.dto';
import { UpdatePioneerFigureDto } from './dto/update-pioneer-figure.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PioneersService {
  constructor(
    @InjectModel(PioneerCategory.name)
    private categoryModel: Model<PioneerCategoryDocument>,
    @InjectModel(PioneerFigure.name)
    private figureModel: Model<PioneerFigureDocument>,
    private uploadService: UploadService,
  ) { }

  // --- Frontend Aggregation (Public) ---

  async findAllForFrontend(district?: string) {
    const categories = await this.categoryModel.find().lean().limit(100).exec();
    const figureQuery = district ? { origin: district } : {};
    const figures = await this.figureModel.find(figureQuery).lean().limit(100).exec();

    // Map the figures into their respective categories matching the Frontend Zod Schema
    const result = categories.map((cat) => {
      const catFigures = figures.filter(
        (fig) =>
          fig.category === cat.categoryName || fig.category === cat.title,
      );

      return {
        id: cat._id.toString(),
        categoryName: cat.categoryName,
        title: cat.title,
        subtitle: cat.subtitle,
        figures: catFigures.map((f: any) => ({
          id: f._id.toString(),
          name: f.name,
          role: f.title, // map db 'title' back to 'role' for UI visual components
          startYear: f.startYear || (f as any).era?.split('-')[0]?.trim() || '',
          endYear: f.endYear || (f as any).era?.split('-')[1]?.trim() || '',
          location: f.origin || '', // map db 'origin' back to 'location'
          biography: f.biography,
          quote: f.quote,
          birthDate: f.birthDate || '',
          deathDate: f.deathDate || '',
          achievements: f.achievements || [],
          authorName: f.authorName || 'فريق توثيق بوابة أبين',
          sourceName: f.sourceName || '',
          sourceUrl: f.sourceUrl || '',
          sources: f.sources || (f.sourceName ? [{ name: f.sourceName, url: f.sourceUrl }] : []),
          images: MediaMapper.extractImages(f),
          bgGradient: 'from-emerald-500 to-emerald-700', // inject default for UI components
        })),
      };
    });

    return result;
  }

  // --- Category Management (Protected) ---

  async createCategory(
    createCategoryDto: CreatePioneerCategoryDto,
  ): Promise<PioneerCategory> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdatePioneerCategoryDto,
  ): Promise<PioneerCategory> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Ø§Ù„ØªØµÙ†ÙŠÙ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯');
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Ø§Ù„ØªØµÙ†ÙŠÙ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯');
    // Also delete associated figures
    await this.figureModel.deleteMany({ category: id }).exec();
  }

  async findAllCategories(): Promise<PioneerCategory[]> {
    return this.categoryModel.find().limit(100).lean().exec();
  }

  // --- Figure Management (Protected) ---

  async createFigure(
    createFigureDto: CreatePioneerFigureDto,
  ): Promise<PioneerFigure> {
    const newFigure = new this.figureModel({
      ...createFigureDto,
      authorName: createFigureDto.authorName?.trim() || 'فريق توثيق بوابة أبين',
    });
    const savedFigure = await newFigure.save();

    let mediaUpdated = false;
    if (savedFigure.images && savedFigure.images.length > 0) {
      savedFigure.images = await this.uploadService.renameMediaUrls(
        savedFigure._id.toString(),
        savedFigure.name,
        savedFigure.images,
        'pioneers',
        'image',
      );
      mediaUpdated = true;
    }

    if (savedFigure.videos && savedFigure.videos.length > 0) {
      savedFigure.videos = await this.uploadService.renameMediaUrls(
        savedFigure._id.toString(),
        savedFigure.name,
        savedFigure.videos,
        'pioneers',
        'video',
      );
      mediaUpdated = true;
    }

    if (mediaUpdated) {
      return savedFigure.save();
    }

    return savedFigure;
  }

  async updateFigure(
    id: string,
    updateFigureDto: UpdatePioneerFigureDto,
  ): Promise<PioneerFigure> {
    const existingFigure = await this.figureModel.findById(id).exec();
    if (!existingFigure) throw new NotFoundException('الشخصية غير موجودة');

    // Clean up removed images
    if (updateFigureDto.images && existingFigure.images) {
      const removedImages = existingFigure.images.filter(img => !updateFigureDto.images?.includes(img));
      if (removedImages.length > 0) {
        await this.uploadService.deleteMultipleMedia(removedImages, 'image');
      }
    }

    // Clean up removed videos
    if (updateFigureDto.videos && existingFigure.videos) {
      const removedVideos = existingFigure.videos.filter(vid => !updateFigureDto.videos?.includes(vid));
      if (removedVideos.length > 0) {
        await this.uploadService.deleteMultipleMedia(removedVideos, 'video');
      }
    }

    const figureName = updateFigureDto.name || existingFigure.name;

    if (updateFigureDto.images && updateFigureDto.images.length > 0) {
      updateFigureDto.images = await this.uploadService.renameMediaUrls(
        id,
        figureName,
        updateFigureDto.images,
        'pioneers',
        'image',
      );
    }

    if (updateFigureDto.videos && updateFigureDto.videos.length > 0) {
      updateFigureDto.videos = await this.uploadService.renameMediaUrls(
        id,
        figureName,
        updateFigureDto.videos,
        'pioneers',
        'video',
      );
    }

    const updated = await this.figureModel
      .findByIdAndUpdate(id, updateFigureDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('الشخصية غير موجودة');
    }

    return updated;
  }

  async deleteFigure(id: string): Promise<void> {
    const existingFigure = await this.figureModel.findById(id).exec();
    if (!existingFigure) throw new NotFoundException('الشخصية غير موجودة');

    if (existingFigure.images && existingFigure.images.length > 0) {
      await this.uploadService.deleteMultipleMedia(existingFigure.images, 'image');
    }
    if (existingFigure.videos && existingFigure.videos.length > 0) {
      await this.uploadService.deleteMultipleMedia(existingFigure.videos, 'video');
    }

    await this.figureModel.findByIdAndDelete(id).exec();
  }

  async findAllFigures(): Promise<PioneerFigure[]> {
    const figures = await this.figureModel.find().limit(100).lean().exec();

    return figures.map((figure: any) => ({
      ...figure,
      images: MediaMapper.extractImages(figure),
    }));
  }
}

