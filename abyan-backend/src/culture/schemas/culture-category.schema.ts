import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class AudioTrack {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  lyricsExcerpt: string;

  // NOTE: External audio URL can be added here later (e.g. audioUrl: string)
}

@Schema({ _id: false })
export class VisualShowcase {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  tag: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  bgGradient: string;

  // NOTE: External video/image URL can be added here later
}

export type CultureCategoryDocument = CultureCategory & Document;

@Schema({ timestamps: true })
export class CultureCategory {
  @Prop({ required: true })
  categoryName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  primaryTags: string[];

  @Prop({ type: [String], default: [] })
  details: string[];

  @Prop({ type: AudioTrack, required: false })
  audioTrack?: AudioTrack;

  @Prop({ type: VisualShowcase, required: false })
  visualShowcase?: VisualShowcase;
  @Prop({ default: true })
  isActive: boolean;
}

export const CultureCategorySchema =
  SchemaFactory.createForClass(CultureCategory);
