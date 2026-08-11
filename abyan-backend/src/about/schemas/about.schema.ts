import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class AboutPillar {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}
export const AboutPillarSchema = SchemaFactory.createForClass(AboutPillar);

@Schema()
export class AboutValue {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}
export const AboutValueSchema = SchemaFactory.createForClass(AboutValue);

@Schema()
export class AboutScope {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], default: [] })
  items: string[];
}
export const AboutScopeSchema = SchemaFactory.createForClass(AboutScope);

@Schema()
export class AboutStat {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  label: string;
}
export const AboutStatSchema = SchemaFactory.createForClass(AboutStat);

@Schema({ timestamps: true })
export class AboutContent extends Document {
  @Prop({ type: [AboutPillarSchema], default: [] })
  pillars: AboutPillar[];

  @Prop({ type: [AboutValueSchema], default: [] })
  values: AboutValue[];

  @Prop({ type: [AboutScopeSchema], default: [] })
  scopes: AboutScope[];

  @Prop({ type: [AboutStatSchema], default: [] })
  stats: AboutStat[];
}

export const AboutContentSchema = SchemaFactory.createForClass(AboutContent);
