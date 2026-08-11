import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArchiveCategoryDocument = ArchiveCategory & Document;

@Schema({ timestamps: true })
export class ArchiveCategory {
  @Prop({ required: true })
  categoryName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  subtitle?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  keyTags?: string[];

  @Prop({ type: [String], default: [] })
  details?: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ArchiveCategorySchema =
  SchemaFactory.createForClass(ArchiveCategory);
