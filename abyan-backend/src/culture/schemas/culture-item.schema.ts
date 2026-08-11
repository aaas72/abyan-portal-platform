import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CultureItemDocument = CultureItem & Document;

@Schema({ timestamps: true })
export class CultureItem {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'CultureCategory',
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

  @Prop({ required: true })
  bgGradient: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  // NOTE: External image URL can be added here later
  @Prop({ default: true })
  isActive: boolean;
}

export const CultureItemSchema =
  SchemaFactory.createForClass(CultureItem);
