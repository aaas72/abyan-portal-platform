import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';
import { TermsContent, TermsContentSchema } from './schemas/terms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TermsContent.name, schema: TermsContentSchema },
    ]),
  ],
  controllers: [TermsController],
  providers: [TermsService],
  exports: [TermsService],
})
export class TermsModule {}
