import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DistrictRegionDocument = DistrictRegion & Document;

@Schema({ timestamps: true })
export class DistrictRegion {
  @Prop({ required: true, unique: true })
  regionKey: string;

  @Prop({ required: true })
  regionLabel: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const DistrictRegionSchema =
  SchemaFactory.createForClass(DistrictRegion);
