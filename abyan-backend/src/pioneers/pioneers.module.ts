import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PioneerCategory,
  PioneerCategorySchema,
} from './schemas/pioneer-category.schema';
import {
  PioneerFigure,
  PioneerFigureSchema,
} from './schemas/pioneer-figure.schema';
import { PioneersService } from './pioneers.service';
import { PioneersController } from './pioneers.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PioneerCategory.name, schema: PioneerCategorySchema },
      { name: PioneerFigure.name, schema: PioneerFigureSchema },
    ]),
    UploadModule,
  ],
  controllers: [PioneersController],
  providers: [PioneersService],
  exports: [PioneersService],
})
export class PioneersModule {}
