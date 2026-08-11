import { PartialType } from '@nestjs/mapped-types';
import { CreateArchiveCategoryDto } from './create-archive-category.dto';

export class UpdateArchiveCategoryDto extends PartialType(
  CreateArchiveCategoryDto,
) {}
