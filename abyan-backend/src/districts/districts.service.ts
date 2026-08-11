import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District, DistrictDocument } from './schemas/district.schema';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { MediaMapper } from '../utils/media.mapper';
import {
  DistrictRegion,
  DistrictRegionDocument,
} from './schemas/district-region.schema';
import { CreateDistrictRegionDto } from './dto/create-district-region.dto';
import { UpdateDistrictRegionDto } from './dto/update-district-region.dto';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
    @InjectModel(DistrictRegion.name)
    private districtRegionModel: Model<DistrictRegionDocument>,
  ) {}

  // --- Frontend Aggregation (Public) ---

  async findAllRegionsForFrontend() {
    const regions = await this.districtRegionModel
      .find({ isActive: true })
      .lean()
      .exec();
    return regions.map((r) => ({
      id: r.regionKey,
      label: r.regionLabel,
      description: r.description,
    }));
  }

  async findAllForFrontend() {
    const districts = await this.districtModel.find().lean().limit(100).exec();

    const result = districts.map((district) => ({
      id: district._id.toString(),
      name: district.name,
      title: district.title,
      region: district.region,
      regionLabel: district.regionLabel,
      capital: district.capital,
      areaKm2: district.areaKm2,
      areaPercentage: district.areaPercentage,
      crops: district.crops,
      landmarks: district.landmarks,
      villages: district.villages,
      description: district.description,
      geography: district.geography,

      // Optional fields
      oldName: district.oldName,
      historyOverview: district.historyOverview,
      historyMilestones: district.historyMilestones,
      climateAndNature: district.climateAndNature,
      famousPioneers: district.famousPioneers,
      pioneersDetails: district.pioneersDetails,
      historicalSites: district.historicalSites,
      economyDetails: district.economyDetails,
      naturalResources: district.naturalResources,
      traditionsAndCulture: district.traditionsAndCulture,
      folkHeritage: district.folkHeritage,
      images:
        MediaMapper.extractImages(district),

      // Embedded Card Lists
      landmarksList: district.landmarksList?.map((l) => ({
        id: (l as any)._id?.toString() || Math.random().toString(), // Mongoose adds _id to subdocs
        name: l.name,
        category: l.category,
        description: l.description,
        images: MediaMapper.extractImages(l),
        bgGradient: l.bgGradient,
      })),
      pioneersList: district.pioneersList?.map((p) => ({
        id: (p as any)._id?.toString() || Math.random().toString(),
        name: p.name,
        role: p.role,
        startYear: p.startYear,
        endYear: p.endYear,
        description: p.description,
        images: MediaMapper.extractImages(p),
        bgGradient: p.bgGradient,
      })),
      pioneersCardList: this.mapCardList(district.pioneersCardList),
      sitesCardList: this.mapCardList(district.sitesCardList),
      cropsCardList: this.mapCardList(district.cropsCardList),
      heritageCardList: this.mapCardList(district.heritageCardList),
    }));

    return result;
  }

  private mapCardList(list: any[]) {
    if (!list) return [];
    return list.map((item) => ({
      id: item._id?.toString() || Math.random().toString(),
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      fullBiography: item.fullBiography,
      images: MediaMapper.extractImages(item),
      bgGradient: item.bgGradient,
    }));
  }

  // --- District Management (Protected) ---

  async createDistrict(
    createDistrictDto: CreateDistrictDto,
  ): Promise<District> {
    const newDistrict = new this.districtModel(createDistrictDto);
    return newDistrict.save();
  }

  async updateDistrict(
    id: string,
    updateDistrictDto: UpdateDistrictDto,
  ): Promise<District> {
    const updated = await this.districtModel
      .findByIdAndUpdate(id, updateDistrictDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Ø§Ù„Ù…Ø¯ÙŠØ±ÙŠØ© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
    return updated;
  }

  async deleteDistrict(id: string): Promise<void> {
    const result = await this.districtModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Ø§Ù„Ù…Ø¯ÙŠØ±ÙŠØ© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
  }

  async findAllDistricts(): Promise<District[]> {
    return this.districtModel.find().limit(100).lean().exec();
  }

  // --- District Region Management (Protected) ---

  async findAllRegions(): Promise<DistrictRegion[]> {
    return this.districtRegionModel.find().limit(100).lean().exec();
  }

  async createRegion(
    createDistrictRegionDto: CreateDistrictRegionDto,
  ): Promise<DistrictRegion> {
    const newRegion = new this.districtRegionModel(createDistrictRegionDto);
    return newRegion.save();
  }

  async updateRegion(
    id: string,
    updateDistrictRegionDto: UpdateDistrictRegionDto,
  ): Promise<DistrictRegion> {
    const updated = await this.districtRegionModel
      .findByIdAndUpdate(id, updateDistrictRegionDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('ÙØ¦Ø© Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
    return updated;
  }

  async deleteRegion(id: string): Promise<void> {
    const result = await this.districtRegionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('ÙØ¦Ø© Ø§Ù„Ø¥Ù‚Ù„ÙŠÙ… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©');
  }
}

