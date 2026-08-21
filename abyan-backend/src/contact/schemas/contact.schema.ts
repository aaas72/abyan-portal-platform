import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ContactEmailChannel {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, required: true })
  email: string;
}
export const ContactEmailChannelSchema = SchemaFactory.createForClass(ContactEmailChannel);

@Schema({ _id: false })
export class ContactPhoneChannel {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, required: true })
  phone: string;
}
export const ContactPhoneChannelSchema = SchemaFactory.createForClass(ContactPhoneChannel);

@Schema({ timestamps: true })
export class ContactInfo {
  _id?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  emails: string[];

  @Prop({ type: [ContactEmailChannelSchema], default: [] })
  emailChannels: ContactEmailChannel[];

  @Prop({ type: [String], default: [] })
  phones: string[];

  @Prop({ type: [ContactPhoneChannelSchema], default: [] })
  phoneChannels: ContactPhoneChannel[];
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);
export type ContactInfoDocument = ContactInfo & Document;
