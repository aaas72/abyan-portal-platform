import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PioneerCategoryDocument = PioneerCategory & Document;

@Schema({ timestamps: true })
export class PioneerCategory {
  @Prop({ required: true })
  categoryName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  keyFigures?: string[];

  @Prop({ type: [String], default: [] })
  details?: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const PioneerCategorySchema =
  SchemaFactory.createForClass(PioneerCategory);
