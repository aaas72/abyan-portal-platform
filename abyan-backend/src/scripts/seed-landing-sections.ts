import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { HighlightsService } from '../highlights/highlights.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const highlightsService = app.get(HighlightsService);

  const sections = [
    {
      sectionId: 'hero',
      name: 'الواجهة الرئيسية (البداية)',
      title: 'بوابة أبين الثقافية',
      subtitle: 'المنصة الثقافية والتاريخية الأولى',
      isActive: true,
    },
    {
      sectionId: 'cultural-highlights',
      name: 'قسم الركائز (مكنونات الهوية)',
      title: 'ركائز ومكنونات هوية أبين',
      subtitle: 'لمحة عن الأركان الأساسية',
      isActive: true,
    },
    {
      sectionId: 'districts',
      name: 'خريطة المديريات',
      title: 'خريطة المحافظة الإدارية',
      subtitle: 'استكشف مديريات أبين',
      isActive: true,
    },
    {
      sectionId: 'timeline',
      name: 'الخط الزمني',
      title: 'تاريخ أبين عبر العصور',
      subtitle: 'محطات تاريخية هامة',
      isActive: true,
    },
  ];

  for (const sec of sections) {
    const existing = await highlightsService.findAllLandingSections();
    const existingSec = existing.find((e) => e.sectionId === sec.sectionId);
    if (!existingSec) {
      await highlightsService.createLandingSection(sec);
      console.log(`Created section: ${sec.name}`);
    } else {
      await highlightsService.updateLandingSection(
        String(existingSec._id),
        sec,
      );
      console.log(`Updated section: ${sec.name}`);
    }
  }

  await app.close();
  console.log('Seeding completed successfully.');
}
bootstrap();
