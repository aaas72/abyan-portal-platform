import { IsString, IsOptional, MaxLength, IsMongoId } from 'class-validator';

export class TrackVisitDto {
  @IsString()
  @MaxLength(100)
  section: string;

  @IsOptional()
  @IsMongoId()
  entityId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  entityName?: string;
}
