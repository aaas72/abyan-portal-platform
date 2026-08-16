import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type EconomyPhotoCardDocument = EconomyPhotoCard & Document;

@Schema({ timestamps: true })
export class EconomyPhotoCard {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'EconomyPillar',
    required: true,
  })
  pillar: Types.ObjectId;

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

  @Prop({ required: true })
  bgGradient: string;
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const EconomyPhotoCardSchema =
  SchemaFactory.createForClass(EconomyPhotoCard);
