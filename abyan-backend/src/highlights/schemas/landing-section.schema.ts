import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LandingSectionDocument = LandingSection & Document;

@Schema({ timestamps: true })
export class LandingSection {
  @Prop({ required: true })
  sectionId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  title?: string;

  @Prop()
  subtitle?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  images?: string[];
}

export const LandingSectionSchema =
  SchemaFactory.createForClass(LandingSection);
