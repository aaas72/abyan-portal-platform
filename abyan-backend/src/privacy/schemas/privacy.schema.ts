import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class PrivacyItem {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  summary?: string;

  @Prop({ type: [String], default: [] })
  items?: string[];
}
export const PrivacyItemSchema = SchemaFactory.createForClass(PrivacyItem);

@Schema({ timestamps: true })
export class PrivacyContent extends Document {
  @Prop({ type: [PrivacyItemSchema], default: [] })
  intro: PrivacyItem[];

  @Prop({ type: [PrivacyItemSchema], default: [] })
  dataCollection: PrivacyItem[];

  @Prop({ type: [PrivacyItemSchema], default: [] })
  usageAndProtection: PrivacyItem[];

  @Prop({ type: [PrivacyItemSchema], default: [] })
  cookiesAndAnalytics: PrivacyItem[];
}

export const PrivacyContentSchema = SchemaFactory.createForClass(PrivacyContent);
