import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArchiveItemDocument = ArchiveItem & Document;

@Schema({ timestamps: true })
export class ArchiveItem {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  categoryLabel: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  aspectRatio: string;

  @Prop({ required: true })
  bgGradient: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ArchiveItemSchema = SchemaFactory.createForClass(ArchiveItem);
