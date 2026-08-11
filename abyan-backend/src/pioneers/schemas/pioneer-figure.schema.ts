import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PioneerFigureDocument = PioneerFigure & Document;

@Schema({ timestamps: true })
export class PioneerFigure {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  biography: string;

  @Prop()
  startYear: string;

  @Prop()
  endYear: string;

  @Prop()
  quote?: string;

  @Prop()
  images?: string[];

  @Prop()
  videos?: string[];

  @Prop({ required: true })
  birthDate: string;

  @Prop({ type: [String], required: true })
  achievements: string[];

  @Prop({ default: true })
  isPublished: boolean;
  @Prop({ default: true })
  isActive: boolean;
}

export const PioneerFigureSchema = SchemaFactory.createForClass(PioneerFigure);
