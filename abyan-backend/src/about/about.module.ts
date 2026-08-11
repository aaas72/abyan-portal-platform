import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AboutContent, AboutContentSchema } from './schemas/about.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AboutContent.name, schema: AboutContentSchema },
    ]),
  ],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
