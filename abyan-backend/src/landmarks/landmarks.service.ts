import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LandmarkCategory,
  LandmarkCategoryDocument,
} from './schemas/landmark-category.schema';
import {
  LandmarkPhotoCard,
  LandmarkPhotoCardDocument,
} from './schemas/landmark-photo-card.schema';
import { CreateLandmarkCategoryDto } from './dto/create-landmark-category.dto';
import { UpdateLandmarkCategoryDto } from './dto/update-landmark-category.dto';
import { CreateLandmarkPhotoCardDto } from './dto/create-landmark-photo-card.dto';
import { UpdateLandmarkPhotoCardDto } from './dto/update-landmark-photo-card.dto';
import { MediaMapper } from '../utils/media.mapper';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class LandmarksService {
  constructor(
    @InjectModel(LandmarkCategory.name)
    private categoryModel: Model<LandmarkCategoryDocument>,
    @InjectModel(LandmarkPhotoCard.name)
    private photoCardModel: Model<LandmarkPhotoCardDocument>,
    private uploadService: UploadService,
  ) {}

  // --- Frontend Aggregation (Public) ---

  async findAllForFrontend(district?: string) {
    const categories = await this.categoryModel.find().lean().limit(100).exec();
    const photoQuery = district ? { location: district } : {};
    const photoCards = await this.photoCardModel.find(photoQuery).lean().limit(100).exec();

    const result = categories.map((cat) => {
      const catPhotos = photoCards.filter(
        (photo) => photo.category.toString() === cat._id.toString(),
      );

      return {
        id: cat._id.toString(),
        categoryName: cat.categoryName,
        title: cat.title,
        subtitle: cat.subtitle,
        description: cat.description,
        keyLandmarks: cat.keyLandmarks,
        details: cat.details,
        photoCards: catPhotos.map((p) => ({
          id: p._id.toString(),
          title: p.title,
          tag: p.tag,
          location: p.location,
          description: p.description,
          bgGradient: p.bgGradient,
          images: MediaMapper.extractImages(p),
          startYear: p.startYear,
          endYear: p.endYear,
        })),
      };
    });

    return result;
  }

  // --- Category Management (Protected) ---

  async createCategory(
    createCategoryDto: CreateLandmarkCategoryDto,
  ): Promise<LandmarkCategory> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateLandmarkCategoryDto,
  ): Promise<LandmarkCategory> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('تصنيف المعالم غير موجود');
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('تصنيف المعالم غير موجود');
    
    // Find associated cards to delete their media
    const cardsToDelete = await this.photoCardModel.find({ category: id }).exec();
    for (const card of cardsToDelete) {
      if (card.images && card.images.length > 0) {
        await this.uploadService.deleteMultipleMedia(card.images, 'image');
      }
    }
    // Also delete associated photo cards
    await this.photoCardModel.deleteMany({ category: id }).exec();
  }

  async findAllCategories(): Promise<LandmarkCategory[]> {
    return this.categoryModel.find().limit(100).lean().exec();
  }

  // --- PhotoCard Management (Protected) ---

  async createPhotoCard(
    createPhotoCardDto: CreateLandmarkPhotoCardDto,
  ): Promise<LandmarkPhotoCard> {
    const newPhotoCard = new this.photoCardModel(createPhotoCardDto);
    const savedPhotoCard = await newPhotoCard.save();

    let mediaUpdated = false;
    if (savedPhotoCard.images && savedPhotoCard.images.length > 0) {
      savedPhotoCard.images = await this.uploadService.renameMediaUrls(
        savedPhotoCard._id.toString(),
        savedPhotoCard.title,
        savedPhotoCard.images,
        'landmarks',
        'image',
      );
      mediaUpdated = true;
    }

    if (mediaUpdated) {
      return savedPhotoCard.save();
    }
    return savedPhotoCard;
  }

  async updatePhotoCard(
    id: string,
    updatePhotoCardDto: UpdateLandmarkPhotoCardDto,
  ): Promise<LandmarkPhotoCard> {
    const existingCard = await this.photoCardModel.findById(id).exec();
    if (!existingCard) throw new NotFoundException('صورة المعلم غير موجودة');

    // Clean up removed images
    if (updatePhotoCardDto.images && existingCard.images) {
      const removedImages = existingCard.images.filter(img => !updatePhotoCardDto.images?.includes(img));
      if (removedImages.length > 0) {
        await this.uploadService.deleteMultipleMedia(removedImages, 'image');
      }
    }

    if (updatePhotoCardDto.images && updatePhotoCardDto.images.length > 0) {
      updatePhotoCardDto.images = await this.uploadService.renameMediaUrls(
        id,
        updatePhotoCardDto.title || existingCard.title,
        updatePhotoCardDto.images,
        'landmarks',
        'image',
      );
    }

    const updated = await this.photoCardModel
      .findByIdAndUpdate(id, updatePhotoCardDto, { new: true })
      .exec();
    return updated!;
  }

  async deletePhotoCard(id: string): Promise<void> {
    const existingCard = await this.photoCardModel.findById(id).exec();
    if (!existingCard) throw new NotFoundException('صورة المعلم غير موجودة');

    if (existingCard.images && existingCard.images.length > 0) {
      await this.uploadService.deleteMultipleMedia(existingCard.images, 'image');
    }

    await this.photoCardModel.findByIdAndDelete(id).exec();
  }

  async findAllPhotoCards(): Promise<LandmarkPhotoCard[]> {
    const photoCards = await this.photoCardModel
      .find()
      .populate('category', 'categoryName title')
      .limit(500)
      .lean()
      .exec();
      
    return photoCards.map((card: any) => ({
      ...card,
      images: MediaMapper.extractImages(card),
    }));
  }
}

