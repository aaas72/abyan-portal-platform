import { PartialType } from '@nestjs/mapped-types';
import { CreateDistrictRegionDto } from './create-district-region.dto';

export class UpdateDistrictRegionDto extends PartialType(
  CreateDistrictRegionDto,
) {}
