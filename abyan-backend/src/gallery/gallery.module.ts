import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArchiveItem, ArchiveItemSchema } from './schemas/archive-item.schema';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';

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
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
