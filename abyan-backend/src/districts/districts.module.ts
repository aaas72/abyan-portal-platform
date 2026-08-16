import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { District, DistrictSchema } from './schemas/district.schema';
import {
  DistrictRegion,
  DistrictRegionSchema,
} from './schemas/district-region.schema';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: District.name, schema: DistrictSchema },
      { name: DistrictRegion.name, schema: DistrictRegionSchema },
    ]),
    UploadModule,
  ],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}
