import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryEraDocument = HistoryEra & Document;

@Schema({ timestamps: true })
export class HistoryEra {
  @Prop({ required: true })
  startYear: string;

  @Prop({ required: true })
  endYear: string;

  @Prop({ required: true })
  eraTitle: string;

  @Prop({ required: true })
  historicalCapital: string;

  @Prop({ required: true })
  shortSummary: string;

  @Prop({ required: true })
  fullDescription: string;

  @Prop({ type: [String], default: [] })
  keyEvents: string[];

  @Prop({ type: [String], default: [] })
  notableLandmarks: string[];
  @Prop({ default: true })
  isActive: boolean;
}

export const HistoryEraSchema = SchemaFactory.createForClass(HistoryEra);
