import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LandmarkCategory,
  LandmarkCategorySchema,
} from './schemas/landmark-category.schema';
import {
  LandmarkPhotoCard,
  LandmarkPhotoCardSchema,
} from './schemas/landmark-photo-card.schema';
import { LandmarksService } from './landmarks.service';
import { LandmarksController } from './landmarks.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LandmarkCategory.name, schema: LandmarkCategorySchema },
      { name: LandmarkPhotoCard.name, schema: LandmarkPhotoCardSchema },
    ]),
    UploadModule,
  ],
  controllers: [LandmarksController],
  providers: [LandmarksService],
  exports: [LandmarksService],
})
export class LandmarksModule {}
