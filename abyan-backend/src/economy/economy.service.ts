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

@Injectable()
export class EconomyService {
  constructor(
    @InjectModel(EconomyPillar.name)
    private pillarModel: Model<EconomyPillarDocument>,
    @InjectModel(EconomyPhotoCard.name)
    private photoCardModel: Model<EconomyPhotoCardDocument>,
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
    return newPillar.save();
  }

  async updatePillar(
    id: string,
    updatePillarDto: UpdateEconomyPillarDto,
  ): Promise<EconomyPillar> {
    const updated = await this.pillarModel
      .findByIdAndUpdate(id, updatePillarDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Ø§Ù„Ø±ÙƒÙŠØ²Ø© Ø§Ù„Ø§Ù‚ØªØµØ§Ø¯ÙŠØ© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
    return updated;
  }

  async deletePillar(id: string): Promise<void> {
    const result = await this.pillarModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Ø§Ù„Ø±ÙƒÙŠØ²Ø© Ø§Ù„Ø§Ù‚ØªØµØ§Ø¯ÙŠØ© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
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
    return newPhotoCard.save();
  }

  async updatePhotoCard(
    id: string,
    updatePhotoCardDto: UpdateEconomyPhotoCardDto,
  ): Promise<EconomyPhotoCard> {
    const updated = await this.photoCardModel
      .findByIdAndUpdate(id, updatePhotoCardDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('ØµÙˆØ±Ø© Ø§Ù„Ø±ÙƒÙŠØ²Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
    return updated;
  }

  async deletePhotoCard(id: string): Promise<void> {
    const result = await this.photoCardModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('ØµÙˆØ±Ø© Ø§Ù„Ø±ÙƒÙŠØ²Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
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

