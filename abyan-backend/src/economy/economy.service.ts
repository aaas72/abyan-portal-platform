import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EconomyPillar,
  EconomyPillarDocument,
} from './schemas/economy-pillar.schema';
import {
  EconomyPhotoCard,
  EconomyPhotoCardDocument,
} from './schemas/economy-photo-card.schema';
import { CreateEconomyPillarDto } from './dto/create-economy-pillar.dto';
import { UpdateEconomyPillarDto } from './dto/update-economy-pillar.dto';
import { CreateEconomyPhotoCardDto } from './dto/create-economy-photo-card.dto';
import { UpdateEconomyPhotoCardDto } from './dto/update-economy-photo-card.dto';
import { MediaMapper } from '../utils/media.mapper';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class EconomyService {
  constructor(
    @InjectModel(EconomyPillar.name)
    private pillarModel: Model<EconomyPillarDocument>,
    @InjectModel(EconomyPhotoCard.name)
    private photoCardModel: Model<EconomyPhotoCardDocument>,
    private uploadService: UploadService,
  ) {}

  // --- Frontend Aggregation (Public) ---

  async findAllForFrontend(district?: string) {
    const pillars = await this.pillarModel.find().lean().limit(100).exec();
    const photoQuery = district ? { location: district } : {};
    const photoCards = await this.photoCardModel.find(photoQuery).lean().limit(100).exec();

    const result = pillars.map((pillar) => {
      const pillarPhotos = photoCards.filter(
        (photo) => photo.pillar.toString() === pillar._id.toString(),
      );

      return {
        id: pillar._id.toString(),
        pillarName: pillar.pillarName,
        title: pillar.title,
        subtitle: pillar.subtitle,
        description: pillar.description,
        keyProducts: pillar.keyProducts,
        details: pillar.details,
        images: MediaMapper.extractImages(pillar),
        photoCards: pillarPhotos.map((p) => ({
          id: p._id.toString(),
          title: p.title,
          tag: p.tag,
          location: p.location,
          description: p.description,
          bgGradient: p.bgGradient,
          images: MediaMapper.extractImages(p),
        })),
      };
    });

    return result;
  }

  // --- Pillar Management (Protected) ---

  async createPillar(
    createPillarDto: CreateEconomyPillarDto,
  ): Promise<EconomyPillar> {
    const newPillar = new this.pillarModel(createPillarDto);
    const savedPillar = await newPillar.save();

    let mediaUpdated = false;
    if (savedPillar.images && savedPillar.images.length > 0) {
      savedPillar.images = await this.uploadService.renameMediaUrls(
        savedPillar._id.toString(),
        savedPillar.title,
        savedPillar.images,
        'economy',
        'image',
      );
      mediaUpdated = true;
    }

    if (mediaUpdated) {
      return savedPillar.save();
    }
    return savedPillar;
  }

  async updatePillar(
    id: string,
    updatePillarDto: UpdateEconomyPillarDto,
  ): Promise<EconomyPillar> {
    const existingPillar = await this.pillarModel.findById(id).exec();
    if (!existingPillar) throw new NotFoundException('الركيزة الاقتصادية غير موجودة');

    // Clean up removed images
    if (updatePillarDto.images && existingPillar.images) {
      const removedImages = existingPillar.images.filter(img => !updatePillarDto.images?.includes(img));
      if (removedImages.length > 0) {
        await this.uploadService.deleteMultipleMedia(removedImages, 'image');
      }
    }

    if (updatePillarDto.images && updatePillarDto.images.length > 0) {
      updatePillarDto.images = await this.uploadService.renameMediaUrls(
        id,
        updatePillarDto.title || existingPillar.title,
        updatePillarDto.images,
        'economy',
        'image',
      );
    }

    const updated = await this.pillarModel
      .findByIdAndUpdate(id, updatePillarDto, { new: true })
      .exec();
    return updated!;
  }

  async deletePillar(id: string): Promise<void> {
    const existingPillar = await this.pillarModel.findById(id).exec();
    if (!existingPillar) throw new NotFoundException('الركيزة الاقتصادية غير موجودة');

    if (existingPillar.images && existingPillar.images.length > 0) {
      await this.uploadService.deleteMultipleMedia(existingPillar.images, 'image');
    }

    // Find associated cards to delete their media
    const cardsToDelete = await this.photoCardModel.find({ pillar: id }).exec();
    for (const card of cardsToDelete) {
      if (card.images && card.images.length > 0) {
        await this.uploadService.deleteMultipleMedia(card.images, 'image');
      }
    }

    await this.pillarModel.findByIdAndDelete(id).exec();
    // Also delete associated photo cards
    await this.photoCardModel.deleteMany({ pillar: id }).exec();
  }

  async findAllPillars(): Promise<EconomyPillar[]> {
    return this.pillarModel.find().limit(100).lean().exec();
  }

  // --- PhotoCard Management (Protected) ---

  async createPhotoCard(
    createPhotoCardDto: CreateEconomyPhotoCardDto,
  ): Promise<EconomyPhotoCard> {
    const newPhotoCard = new this.photoCardModel(createPhotoCardDto);
    const savedPhotoCard = await newPhotoCard.save();

    let mediaUpdated = false;
    if (savedPhotoCard.images && savedPhotoCard.images.length > 0) {
      savedPhotoCard.images = await this.uploadService.renameMediaUrls(
        savedPhotoCard._id.toString(),
        savedPhotoCard.title,
        savedPhotoCard.images,
        'economy',
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
    updatePhotoCardDto: UpdateEconomyPhotoCardDto,
  ): Promise<EconomyPhotoCard> {
    const existingCard = await this.photoCardModel.findById(id).exec();
    if (!existingCard) throw new NotFoundException('صورة الركيزة غير موجودة');

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
        'economy',
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
    if (!existingCard) throw new NotFoundException('صورة الركيزة غير موجودة');

    if (existingCard.images && existingCard.images.length > 0) {
      await this.uploadService.deleteMultipleMedia(existingCard.images, 'image');
    }

    await this.photoCardModel.findByIdAndDelete(id).exec();
  }

  async findAllPhotoCards(): Promise<EconomyPhotoCard[]> {
    const photoCards = await this.photoCardModel
      .find()
      .populate('pillar', 'pillarName title')
      .limit(500)
      .lean()
      .exec();
      
    return photoCards.map((card: any) => ({
      ...card,
      images: MediaMapper.extractImages(card),
    }));
  }
}

