import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ContactInfo {
  _id?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  emails: string[];

  @Prop({ type: [String], default: [] })
  phones: string[];
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);
export type ContactInfoDocument = ContactInfo & Document;
