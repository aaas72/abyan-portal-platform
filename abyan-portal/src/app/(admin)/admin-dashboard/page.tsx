import React from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import UniversalCard from '@/components/cards/UniversalCard';
import { DistrictsService } from '@/services/districts.service';
import { PioneersService } from '@/services/pioneers.service';
import { LandmarksService } from '@/services/landmarks.service';
import { GalleryService } from '@/services/gallery.service';
import { HistoryService } from '@/services/history.service';
import { CultureService } from '@/services/culture.service';
import { EconomyService } from '@/services/economy.service';
import AnalyticsStats from '@/components/admin/AnalyticsStats';

export default async function AdminDashboardPage() {
  // Fetch real statistics from Services
  const districts = await DistrictsService.getAllDistricts();
  const pioneerCategories = await PioneersService.getCategories();
  const landmarkCategories = await LandmarksService.getCategories();
  const archiveItems = await GalleryService.getArchive();
  const historyEras = await HistoryService.getEras();
  const cultureCategories = await CultureService.getCategories();
  const economyPillars = await EconomyService.getPillars();
  const audioTracks = cultureCategories.filter(c => !!c.audioTrack);

  const totalDistricts = districts.length;
  const totalPioneers = pioneerCategories.reduce((acc, cat) => acc + cat.figures.length, 0);
  const totalLandmarks = landmarkCategories.reduce((acc, cat) => acc + cat.keyLandmarks.length, 0);
  const totalArchiveItems = archiveItems.length;
  const totalEras = historyEras.length;
  const totalCultureItems = cultureCategories.length;
  const totalEconomyItems = economyPillars.reduce((acc, pillar) => acc + pillar.keyProducts.length, 0);

  const stats = [
    { label: 'المديريات الموثقة', value: totalDistricts },
    { label: 'إجمالي الأعلام والشخصيات', value: totalPioneers },
    { label: 'المعالم والمواقع الأثرية', value: totalLandmarks },
    { label: 'الوثائق في الأرشيف الرقمي', value: totalArchiveItems },
    { label: 'الحقب التاريخية', value: totalEras },
    { label: 'عناصر الموروث الثقافي', value: totalCultureItems },
    { label: 'عناصر الاقتصاد والموارد', value: totalEconomyItems },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="لوحة القيادة"
        description="المركز الرئيسي لإدارة محتوى بوابة أبين الثقافية"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <UniversalCard 
            key={idx} 
            variant="stat" 
            data={{
              title: stat.value.toString(),
              description: stat.label
            }} 
          />
        ))}
      </div>
      
      <AnalyticsStats />
    </div>
  );
}
