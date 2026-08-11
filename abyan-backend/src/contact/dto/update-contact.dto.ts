import { IsArray, IsString, IsEmail, ArrayMaxSize, IsOptional } from 'class-validator';

export class UpdateContactDto {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsEmail({}, { each: true, message: 'Must be a valid email' })
  @ArrayMaxSize(5, { message: 'Maximum 5 emails allowed' })
  emails?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(5, { message: 'Maximum 5 phones allowed' })
  phones?: string[];
}
