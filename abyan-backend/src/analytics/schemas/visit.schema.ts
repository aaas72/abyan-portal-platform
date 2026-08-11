import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisitDocument = Visit & Document;

@Schema({ timestamps: true })
export class Visit {
  @Prop({ required: true, index: true })
  section: string;

  @Prop({ required: true, index: true })
  ipHash: string;
  @Prop({ required: false, index: true })
  entityId?: string;

  @Prop({ required: false })
  entityName?: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);

// Compound index to quickly find if an IP visited a section recently
VisitSchema.index({ section: 1, ipHash: 1, createdAt: -1 });
