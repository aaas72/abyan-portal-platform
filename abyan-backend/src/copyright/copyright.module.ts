import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CopyrightService } from './copyright.service';
import { CopyrightController } from './copyright.controller';
import { CopyrightContent, CopyrightContentSchema } from './schemas/copyright.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CopyrightContent.name, schema: CopyrightContentSchema },
    ]),
  ],
  controllers: [CopyrightController],
  providers: [CopyrightService],
  exports: [CopyrightService],
})
export class CopyrightModule {}
