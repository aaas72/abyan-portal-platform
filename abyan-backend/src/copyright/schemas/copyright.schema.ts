import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class CopyrightItem {
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
export const CopyrightItemSchema = SchemaFactory.createForClass(CopyrightItem);

@Schema({ timestamps: true })
export class CopyrightContent extends Document {
  @Prop({ type: [CopyrightItemSchema], default: [] })
  declarations: CopyrightItem[];

  @Prop({ type: [CopyrightItemSchema], default: [] })
  pillars: CopyrightItem[];

  @Prop({ type: [CopyrightItemSchema], default: [] })
  guidelines: CopyrightItem[];

  @Prop({ type: [CopyrightItemSchema], default: [] })
  contactNotice: CopyrightItem[];
}

export const CopyrightContentSchema = SchemaFactory.createForClass(CopyrightContent);
