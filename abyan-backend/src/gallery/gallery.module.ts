import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArchiveItem, ArchiveItemSchema } from './schemas/archive-item.schema';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { UploadModule } from '../upload/upload.module';

import {
  ArchiveCategory,
  ArchiveCategorySchema,
} from './schemas/archive-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArchiveItem.name, schema: ArchiveItemSchema },
      { name: ArchiveCategory.name, schema: ArchiveCategorySchema },
    ]),
    UploadModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
