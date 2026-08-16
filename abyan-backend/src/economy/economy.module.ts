import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EconomyPillar,
  EconomyPillarSchema,
} from './schemas/economy-pillar.schema';
import {
  EconomyPhotoCard,
  EconomyPhotoCardSchema,
} from './schemas/economy-photo-card.schema';
import { EconomyService } from './economy.service';
import { EconomyController } from './economy.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EconomyPillar.name, schema: EconomyPillarSchema },
      { name: EconomyPhotoCard.name, schema: EconomyPhotoCardSchema },
    ]),
    UploadModule,
  ],
  controllers: [EconomyController],
  providers: [EconomyService],
  exports: [EconomyService],
})
export class EconomyModule {}
