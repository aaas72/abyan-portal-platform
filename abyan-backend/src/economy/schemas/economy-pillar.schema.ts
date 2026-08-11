import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EconomyPillarDocument = EconomyPillar & Document;

@Schema({ timestamps: true })
export class EconomyPillar {
  @Prop({ required: true })
  pillarName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  keyProducts: string[];

  @Prop({ type: [String], default: [] })
  details: string[];
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const EconomyPillarSchema = SchemaFactory.createForClass(EconomyPillar);
