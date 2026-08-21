import { IsArray, IsString, IsEmail, ArrayMaxSize, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ContactEmailChannelDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;
}

export class ContactPhoneChannelDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  phone: string;
}

export class UpdateContactDto {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsEmail({}, { each: true, message: 'Must be a valid email' })
  @ArrayMaxSize(10, { message: 'Maximum 10 emails allowed' })
  emails?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContactEmailChannelDto)
  emailChannels?: ContactEmailChannelDto[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: 'Maximum 10 phones allowed' })
  phones?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContactPhoneChannelDto)
  phoneChannels?: ContactPhoneChannelDto[];
}
