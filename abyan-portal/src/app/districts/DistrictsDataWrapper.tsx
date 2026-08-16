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

  // Dictionary of geographic aliases for each district
  const DISTRICT_ALIASES: Record<string, string[]> = {
    "زنجبار": ["زنجبار", "دلتا أبين", "دلتا بنا", "الكود", "حسان", "ساحل أبين", "الساحل", "باشحارة", "المطلع"],
    "خنفر": ["خنفر", "جعار", "دلتا أبين", "دلتا بنا", "باتيس", "الحصن", "الدرجاج", "سد باتيس", "المخزن", "الروى", "جول السادة"],
    "لودر": ["لودر", "دمان", "العين", "ثرة", "امصرة", "دثينة", "الكور", "جبل ثرة", "شروان", "أماجل"],
    "مودية": ["مودية", "دثينة", "عكد", "جبل عكد", "مران", "القليتة", "الجبلة"],
    "أحور": ["أحور", "وادي أحور", "حناذ", "بندر أحور", "المساني", "الشريط الساحلي"],
    "رصد": ["رصد", "يافع", "يافع القارة", "يافع بني قاصد", "القارة", "السعدي", "رخمة", "العمري"],
    "سرار": ["سرار", "يافع", "كلد", "يافع كلد", "حمة", "امهاة"],
    "سباح": ["سباح", "يافع", "يافع بني قاصد", "مرصع", "العيسائي"],
    "المحفد": ["المحفد", "وادي ضيقة", "باكازم", "المهفد", "المعجلة", "صيعر"],
    "الوضيع": ["الوضيع", "دثينة", "السواد", "ردوم", "موجان"],
    "جيشان": ["جيشان", "وادي ضراء", "سهوة", "امرحب"],
  };

  const matchesGeo = (loc: string | undefined, distName: string) => {
    if (!loc) return false;
    const aliases = DISTRICT_ALIASES[distName] || [distName];
    return aliases.some(a => loc.includes(a));
  };

  // Map the relational data to each district
  const enrichedDistricts = allDistricts.map((district) => {
    // 1. Pioneers matching
    const pioneerItemsMap = new Map<string, any>();
    // Match by location / aliases
    flatPioneers.forEach(p => {
      if (matchesGeo(p.location, district.name)) {
        pioneerItemsMap.set(p.id, {
          id: p.id,
          title: p.name,
          subtitle: p.role,
          description: p.biography,
          fullBiography: p.biography,
          bgGradient: p.bgGradient,
          images: p.images,
          category: p.categoryTitle || "أعلام ورموز",
          startYear: p.startYear,
          endYear: p.endYear,
          location: p.location || district.name,
        });
      }
    });
    // Match by famous pioneers list
    (district.famousPioneers || []).forEach((pName, idx) => {
      const match = flatPioneers.find(p => p.name && (p.name.includes(pName) || pName.includes(p.name)));
      if (match && !pioneerItemsMap.has(match.id)) {
        pioneerItemsMap.set(match.id, {
          id: match.id,
          title: match.name,
          subtitle: match.role,
          description: match.biography,
          fullBiography: match.biography,
          bgGradient: match.bgGradient,
          images: match.images,
          category: match.categoryTitle || "علم بالمديرية",
          startYear: match.startYear,
          endYear: match.endYear,
          location: match.location || district.name,
        });
      } else if (!match && !pioneerItemsMap.has(`famous-${idx}`)) {
        pioneerItemsMap.set(`famous-${idx}`, {
          id: `famous-${idx}`,
          title: pName,
          subtitle: `رمز وعلم من أعلام مديرية ${district.name}`,
          description: `${pName} هو أحد أعمدة وشخصيات مديرية ${district.name} البارزة في التاريخ والتراث الأبيني.`,
          fullBiography: `${pName} هو أحد أعمدة وشخصيات مديرية ${district.name} البارزة في التاريخ والتراث الأبيني.`,
          category: "علم بالمديرية",
          location: district.name,
          bgGradient: "from-emerald-50 to-sky-50",
        });
      }
    });

    // 2. Landmarks / Sites matching
    const siteItemsMap = new Map<string, any>();
    flatLandmarks.forEach(l => {
      if (matchesGeo(l.location, district.name)) {
        siteItemsMap.set(l.id, {
          id: l.id,
          title: l.title,
          subtitle: l.tag,
          description: l.description,
          fullBiography: l.description,
          bgGradient: l.bgGradient,
          images: l.images,
          category: l.categoryTitle || "معلم أثري",
          location: l.location || district.name,
        });
      }
    });
    [...(district.landmarks || []), ...(district.historicalSites || [])].forEach((sName, idx) => {
      const match = flatLandmarks.find(l => 
        (l.title && (l.title.includes(sName) || sName.includes(l.title))) ||
        (l.tag && (l.tag.includes(sName) || sName.includes(l.tag)))
      );
      if (match && !siteItemsMap.has(match.id)) {
        siteItemsMap.set(match.id, {
          id: match.id,
          title: match.title,
          subtitle: match.tag,
          description: match.description,
          fullBiography: match.description,
          bgGradient: match.bgGradient,
          images: match.images,
          category: match.categoryTitle || "معلم أثري",
          location: match.location || district.name,
        });
      } else if (!match && !siteItemsMap.has(`site-${idx}`)) {
        siteItemsMap.set(`site-${idx}`, {
          id: `site-${idx}`,
          title: sName,
          subtitle: `معلم بارز في مديرية ${district.name}`,
          description: `${sName} أحد المعالم والشواهد الجغرافية والتاريخية البارزة في مديرية ${district.name}.`,
          fullBiography: `${sName} أحد المعالم والشواهد الجغرافية والتاريخية البارزة في مديرية ${district.name}.`,
          category: "معلم بارز",
          location: district.name,
          bgGradient: "from-emerald-950 via-sky-900 to-slate-900",
        });
      }
    });

    // 3. Economy / Crops matching
    const cropItemsMap = new Map<string, any>();
    flatEconomy.forEach(e => {
      if (matchesGeo(e.location, district.name)) {
        cropItemsMap.set(e.id, {
          id: e.id,
          title: e.title,
          subtitle: e.tag,
          description: e.description,
          fullBiography: e.description,
          bgGradient: e.bgGradient,
          images: e.images,
          category: e.categoryTitle || "خيرات الأرض",
          location: e.location || district.name,
        });
      }
    });
    (district.crops || []).forEach((cName, idx) => {
      const match = flatEconomy.find(e => 
        (e.title && (e.title.includes(cName) || cName.includes(e.title))) ||
        (e.tag && (e.tag.includes(cName) || cName.includes(e.tag))) ||
        (e.description && e.description.includes(cName))
      );
      if (match && !cropItemsMap.has(match.id)) {
        cropItemsMap.set(match.id, {
          id: match.id,
          title: match.title,
          subtitle: match.tag,
          description: match.description,
          fullBiography: match.description,
          bgGradient: match.bgGradient,
          images: match.images,
          category: match.categoryTitle || "خيرات الأرض",
          location: match.location || district.name,
        });
      } else if (!match && !cropItemsMap.has(`crop-${idx}`)) {
        cropItemsMap.set(`crop-${idx}`, {
          id: `crop-${idx}`,
          title: cName,
          subtitle: `محصول وثروة خصيبة في ${district.name}`,
          description: `${cName} ركن أساسي من الثروات والمحاصيل التي تعتز بها مديرية ${district.name}.`,
          fullBiography: `${cName} ركن أساسي من الثروات والمحاصيل التي تعتز بها مديرية ${district.name}.`,
          category: "خيرات الأرض",
          location: district.name,
          bgGradient: "from-emerald-950 via-slate-800 to-sky-900",
        });
      }
    });

    // 4. Culture / Heritage matching
    const heritageItemsMap = new Map<string, any>();
    flatCulture.forEach(c => {
      if (matchesGeo(c.location, district.name)) {
        heritageItemsMap.set(c.id, {
          id: c.id,
          title: c.title,
          subtitle: c.tag,
          description: c.description,
          fullBiography: c.description,
          bgGradient: c.bgGradient,
          images: c.images,
          category: c.categoryTitle || "موروث وفلكلور",
          location: c.location || district.name,
        });
      }
    });
    (district.folkHeritage || []).forEach((hName, idx) => {
      const match = flatCulture.find(c => 
        (c.title && (c.title.includes(hName) || hName.includes(c.title))) ||
        (c.tag && (c.tag.includes(hName) || hName.includes(c.tag))) ||
        (c.description && c.description.includes(hName))
      );
      if (match && !heritageItemsMap.has(match.id)) {
        heritageItemsMap.set(match.id, {
          id: match.id,
          title: match.title,
          subtitle: match.tag,
          description: match.description,
          fullBiography: match.description,
          bgGradient: match.bgGradient,
          images: match.images,
          category: match.categoryTitle || "موروث وفلكلور",
          location: match.location || district.name,
        });
      } else if (!match && !heritageItemsMap.has(`heritage-${idx}`)) {
        heritageItemsMap.set(`heritage-${idx}`, {
          id: `heritage-${idx}`,
          title: hName,
          subtitle: `موروث وفلكلور أصيل في ${district.name}`,
          description: `${hName} فن وموروث فلكلوري شفاهي يتوارثه أهالي مديرية ${district.name}.`,
          fullBiography: `${hName} فن وموروث فلكلوري شفاهي يتوارثه أهالي مديرية ${district.name}.`,
          category: "موروث وفلكلور",
          location: district.name,
          bgGradient: "from-sky-950 via-emerald-950 to-slate-900",
        });
      }
    });

    return {
      ...district,
      pioneersCardList: Array.from(pioneerItemsMap.values()),
      sitesCardList: Array.from(siteItemsMap.values()),
      cropsCardList: Array.from(cropItemsMap.values()),
      heritageCardList: Array.from(heritageItemsMap.values()),
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
