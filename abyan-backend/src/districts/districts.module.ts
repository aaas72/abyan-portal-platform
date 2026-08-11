import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { District, DistrictSchema } from './schemas/district.schema';
import {
  DistrictRegion,
  DistrictRegionSchema,
} from './schemas/district-region.schema';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: District.name, schema: DistrictSchema },
      { name: DistrictRegion.name, schema: DistrictRegionSchema },
    ]),
  ],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}
