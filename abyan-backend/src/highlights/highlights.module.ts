import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HighlightItem,
  HighlightItemSchema,
} from './schemas/highlight-item.schema';
import {
  LandingSection,
  LandingSectionSchema,
} from './schemas/landing-section.schema';
import { HighlightsService } from './highlights.service';
import { HighlightsController } from './highlights.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HighlightItem.name, schema: HighlightItemSchema },
      { name: LandingSection.name, schema: LandingSectionSchema },
    ]),
  ],
  controllers: [HighlightsController],
  providers: [HighlightsService],
  exports: [HighlightsService],
})
export class HighlightsModule {}
