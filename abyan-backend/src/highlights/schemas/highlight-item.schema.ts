import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HighlightItemDocument = HighlightItem & Document;

@Schema({ timestamps: true })
export class HighlightItem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  linkText: string;

  @Prop({ required: true })
  href: string;
  @Prop({ default: true })
  isActive: boolean;
}

export const HighlightItemSchema = SchemaFactory.createForClass(HighlightItem);
