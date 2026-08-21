import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';
import { PrivacyContent, PrivacyContentSchema } from './schemas/privacy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrivacyContent.name, schema: PrivacyContentSchema },
    ]),
  ],
  controllers: [PrivacyController],
  providers: [PrivacyService],
  exports: [PrivacyService],
})
export class PrivacyModule {}
