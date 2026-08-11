import React from "react";
import { DistrictsService } from "@/services/districts.service";
import { PioneersService } from "@/services/pioneers.service";
import { LandmarksService } from "@/services/landmarks.service";
import { EconomyService } from "@/services/economy.service";
import { CultureService } from "@/services/culture.service";
import DistrictsClient from "@/components/features/districts/DistrictsClient";

export default async function DistrictsDataWrapper() {
  // Deliberate artificial delay for inspecting Purple Geometric Skeleton


  const allDistricts = await DistrictsService.getAllDistricts();
  const dbRegions = await DistrictsService.getFrontendRegions();

  // Fetch all relational data globally
  const [allPioneers, allLandmarks, allEconomy, allCulture] = await Promise.all([
    PioneersService.getCategories(),
    LandmarksService.getCategories(),
    EconomyService.getPillars(),
    CultureService.getCategories(),
  ]);

  // Extract flat lists of items for easier filtering
  const flatPioneers = allPioneers.flatMap(c => 
    c.figures.map(f => ({ ...f, categoryTitle: c.title }))
  );
  const flatLandmarks = allLandmarks.flatMap(c => 
    (c.photoCards || []).map(l => ({ ...l, categoryTitle: c.title }))
  );
  const flatEconomy = allEconomy.flatMap(c => 
    (c.photoCards || []).map(e => ({ ...e, categoryTitle: c.title }))
  );
  const flatCulture = allCulture.flatMap(c => 
    (c.items || []).map(f => ({ ...f, categoryTitle: c.title }))
  );

  // Map the relational data to each district
  const enrichedDistricts = allDistricts.map((district) => {
    // Note: The location string might contain additional details, so we use includes()
    const districtPioneers = flatPioneers.filter(p => p.location && p.location.includes(district.name));
    const districtLandmarks = flatLandmarks.filter(l => l.location && l.location.includes(district.name));
    const districtEconomy = flatEconomy.filter(e => e.location && e.location.includes(district.name));
    const districtCulture = flatCulture.filter(c => c.location && c.location.includes(district.name));

    return {
      ...district,
      pioneersCardList: districtPioneers.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: p.role,
        description: p.biography,
        fullBiography: p.biography,
        bgGradient: p.bgGradient,
        images: p.images,
        category: p.categoryTitle,
        startYear: p.startYear,
        endYear: p.endYear,
        location: p.location,
      })),
      sitesCardList: districtLandmarks.map(l => ({
        id: l.id,
        title: l.title,
        subtitle: l.tag,
        description: l.description,
        fullBiography: l.description,
        bgGradient: l.bgGradient,
        images: l.images,
        category: l.categoryTitle,
        location: l.location,
      })),
      cropsCardList: districtEconomy.map(e => ({
        id: e.id,
        title: e.title,
        subtitle: e.tag,
        description: e.description,
        fullBiography: e.description,
        bgGradient: e.bgGradient,
        images: e.images,
        category: e.categoryTitle,
        location: e.location,
      })),
      heritageCardList: districtCulture.map(c => ({
        id: c.id,
        title: c.title,
        subtitle: c.tag,
        description: c.description,
        fullBiography: c.description,
        bgGradient: c.bgGradient,
        images: c.images,
        category: c.categoryTitle,
        location: c.location,
      })),
    };
  });
  
  const regions = [
    { 
      id: "all", 
      label: `جميع المديريات (${enrichedDistricts.length})`,
      description: "تضم محافظة أبين 11 مديرية تتوزع على مناطق جغرافية متنوعة، وتزخر بتاريخ عريق وثروات زراعية وطبيعية تشكل ركيزة أساسية للاقتصاد والتراث."
    },
    ...dbRegions
  ];

  return <DistrictsClient allDistricts={enrichedDistricts as any} regions={regions} />;
}
