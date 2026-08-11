import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LandmarkCategoryDocument = LandmarkCategory & Document;

@Schema({ timestamps: true })
export class LandmarkCategory {
  @Prop({ required: true })
  categoryName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  keyLandmarks: string[];

  @Prop({ type: [String], default: [] })
  details: string[];
  @Prop({ default: true })
  isActive: boolean;
}

export const LandmarkCategorySchema =
  SchemaFactory.createForClass(LandmarkCategory);
