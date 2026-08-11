import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class LandmarkDetail {
  @Prop({ required: true })
  name: string;

  @Prop()
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  bgGradient: string;
}

@Schema({ _id: false })
export class PioneerDetail {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  startYear: string;

  @Prop()
  endYear: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  bgGradient: string;
}

@Schema({ _id: false })
export class DistrictCardItem {
  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  fullBiography: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  bgGradient: string;
}

export type DistrictDocument = District & Document;

@Schema({ timestamps: true })
export class District {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  regionLabel: string;

  @Prop({ required: true })
  capital: string;

  @Prop({ required: true })
  areaKm2: string;

  @Prop({ required: true })
  areaPercentage: string;

  @Prop()
  population: string;

  @Prop({ type: [String], default: [] })
  crops: string[];

  @Prop({ type: [String], default: [] })
  landmarks: string[];

  @Prop({ type: [String], default: [] })
  villages: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  geography: string;

  @Prop()
  oldName: string;

  @Prop()
  historyOverview: string;

  @Prop({ type: [String], default: [] })
  historyMilestones: string[];

  @Prop()
  climateAndNature: string;

  @Prop({ type: [String], default: [] })
  famousPioneers: string[];

  @Prop({ type: [String], default: [] })
  pioneersDetails: string[];

  @Prop({ type: [String], default: [] })
  historicalSites: string[];

  @Prop()
  economyDetails: string;

  @Prop({ type: [String], default: [] })
  naturalResources: string[];

  @Prop()
  traditionsAndCulture: string;

  @Prop({ type: [String], default: [] })
  folkHeritage: string[];

  @Prop({ type: [LandmarkDetail], default: [] })
  landmarksList: LandmarkDetail[];

  @Prop({ type: [PioneerDetail], default: [] })
  pioneersList: PioneerDetail[];

  @Prop({ type: [DistrictCardItem], default: [] })
  pioneersCardList: DistrictCardItem[];

  @Prop({ type: [DistrictCardItem], default: [] })
  sitesCardList: DistrictCardItem[];

  @Prop({ type: [DistrictCardItem], default: [] })
  cropsCardList: DistrictCardItem[];

  @Prop({ type: [DistrictCardItem], default: [] })
  heritageCardList: DistrictCardItem[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
