import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type LandmarkPhotoCardDocument = LandmarkPhotoCard & Document;

@Schema({ timestamps: true })
export class LandmarkPhotoCard {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'LandmarkCategory',
    required: true,
  })
  category: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  tag: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: 'فريق توثيق بوابة أبين' })
  authorName: string;

  @Prop()
  sourceName?: string;

  @Prop()
  sourceUrl?: string;

  @Prop({
    type: [{ name: { type: String, required: true }, url: { type: String } }],
    default: [],
  })
  sources?: Array<{ name: string; url?: string }>;

  @Prop({ required: false, default: 'from-emerald-500/20 to-sky-500/20' })
  bgGradient: string;
  @Prop({ required: false })
  images?: string[];

  @Prop({ required: false })
  startYear?: string;

  @Prop({ required: false })
  endYear?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const LandmarkPhotoCardSchema =
  SchemaFactory.createForClass(LandmarkPhotoCard);
