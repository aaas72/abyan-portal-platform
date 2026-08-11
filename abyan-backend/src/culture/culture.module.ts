import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CultureCategory,
  CultureCategorySchema,
} from './schemas/culture-category.schema';
import { CultureItem, CultureItemSchema } from './schemas/culture-item.schema';
import { CultureService } from './culture.service';
import { CultureController } from './culture.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CultureCategory.name, schema: CultureCategorySchema },
      { name: CultureItem.name, schema: CultureItemSchema },
    ]),
  ],
  controllers: [CultureController],
  providers: [CultureService],
  exports: [CultureService],
})
export class CultureModule {}
