import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class TermsItem {
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
export const TermsItemSchema = SchemaFactory.createForClass(TermsItem);

@Schema({ timestamps: true })
export class TermsContent extends Document {
  @Prop({ type: [TermsItemSchema], default: [] })
  intro: TermsItem[];

  @Prop({ type: [TermsItemSchema], default: [] })
  usageRules: TermsItem[];

  @Prop({ type: [TermsItemSchema], default: [] })
  intellectualProperty: TermsItem[];

  @Prop({ type: [TermsItemSchema], default: [] })
  disclaimer: TermsItem[];
}

export const TermsContentSchema = SchemaFactory.createForClass(TermsContent);
