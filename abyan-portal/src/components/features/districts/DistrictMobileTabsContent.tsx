import React from "react";
import { TagList } from "@/components/ui";
import UniversalCard from "@/components/cards/UniversalCard";
import { DistrictItem } from "@/types/schemas";

type DistrictSubTab =
  | "history"
  | "nature"
  | "pioneers"
  | "sites"
  | "economy"
  | "culture"
  | "villages";

interface Props {
  activeSubTab: DistrictSubTab;
  dist: DistrictItem;
  setSelectedMediaItem: (item: any) => void;
}

export default function DistrictMobileTabsContent({
  activeSubTab,
  dist,
  setSelectedMediaItem,
}: Props) {
  return (
    <div className="space-y-4 pt-1">
      {activeSubTab === "history" && (
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
            {dist.description}
          </p>
          {dist.historyOverview && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                النشأة والمسار التاريخي:
              </h4>
              <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
                {dist.historyOverview}
              </p>
            </div>
          )}
          {dist.historyMilestones && dist.historyMilestones.length > 0 && (
            <div className="pt-2">
              <TagList
                title="محطات وأحداث مفصلية بالمديرية:"
                items={dist.historyMilestones}
                variant="pure-text"
                color="emerald"
              />
            </div>
          )}
        </div>
      )}

      {activeSubTab === "nature" && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
              التضاريس والموقع الجغرافي:
            </h4>
            <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
              {dist.geography}
            </p>
          </div>
          {dist.climateAndNature && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                المناخ والطبيعة البيئية:
              </h4>
              <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
                {dist.climateAndNature}
              </p>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "pioneers" && (
        <div className="space-y-4">
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none mb-2">
            أعلام وشخصيات المديرية الوطنية والتاريخية:
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {dist.pioneersCardList && dist.pioneersCardList.length > 0
              ? dist.pioneersCardList.map((pioneer) => (
                  <UniversalCard
                    key={pioneer.id}
                    variant="pioneer"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: pioneer.id,
                        title: pioneer.title,
                        subtitle: pioneer.subtitle,
                        fullBiography:
                          pioneer.fullBiography || pioneer.description,
                        categoryLabel: pioneer.category || "رمز وطني وتاريخي",
                        location: pioneer.location || dist.name,
                        year: `${pioneer.startYear || ""}\u00A0\u00A0-\u00A0\u00A0${pioneer.endYear || ""}`,
                        bgGradient: pioneer.bgGradient,
                        images: pioneer.images,
                      })
                    }
                    data={{
                      title: pioneer.title,
                      category: pioneer.category || "رمز وطني وتاريخي",
                      subtitle: pioneer.subtitle,
                      description: pioneer.description,
                      location: pioneer.location || dist.name,
                      startYear: pioneer.startYear || "",
                      endYear: pioneer.endYear || "",
                      bgGradient: pioneer.bgGradient,
                      images: pioneer.images,
                    }}
                  />
                ))
              : dist.famousPioneers?.map((pioneer, idx) => (
                  <UniversalCard
                    key={idx}
                    variant="pioneer"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: `famous-${idx}`,
                        title: pioneer,
                        subtitle: `رمز وعلم من أعلام مديرية ${dist.name}`,
                        fullBiography: `${pioneer} هو أحد أعمدة وشخصيات مديرية ${dist.name} البارزة في التاريخ والتراث الأبيني.`,
                        categoryLabel: `علم بالمديرية • ${dist.name}`,
                        location: dist.name,
                        year: "رواد أبين",
                        bgGradient: "from-emerald-50 to-sky-50",
                      })
                    }
                    data={{
                      title: pioneer,
                      category: `علم بالمديرية • ${dist.name}`,
                      subtitle: `رمز وعلم من أعلام مديرية ${dist.name}`,
                      description: `${pioneer} هو أحد أعمدة وشخصيات مديرية ${dist.name} البارزة في التاريخ والتراث الأبيني.`,
                      location: dist.name,
                      era: "رواد أبين",
                      bgGradient: "from-emerald-50 to-sky-50",
                    }}
                  />
                ))}
          </div>
        </div>
      )}

      {/* TAB 4: SITES & LANDMARKS */}
      {activeSubTab === "sites" && (
        <div className="space-y-4">
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            الشواهد والمعالم والحصون الأثرية بالمديرية:
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {dist.sitesCardList && dist.sitesCardList.length > 0
              ? dist.sitesCardList.map((site) => (
                  <UniversalCard
                    key={site.id}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: site.id,
                        title: site.title,
                        subtitle: site.subtitle,
                        fullBiography: site.fullBiography || site.description,
                        categoryLabel: `معلم أثري • مديرية ${dist.name}`,
                        location: dist.name,
                        bgGradient: site.bgGradient,
                        images: site.images,
                      })
                    }
                    data={{
                      title: site.title,
                      category: `معلم أثري • ${dist.name}`,
                      description: site.subtitle || site.description,
                      location: dist.name,
                      bgGradient: site.bgGradient,
                      images: site.images,
                    }}
                  />
                ))
              : dist.landmarks.map((landmark, idx) => (
                  <UniversalCard
                    key={idx}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: `landmark-${idx}`,
                        title: landmark,
                        subtitle: `معلم بارز في مديرية ${dist.name}`,
                        fullBiography: `${landmark} أحد المعالم والشواهد الجغرافية والتاريخية البارزة في مديرية ${dist.name}.`,
                        categoryLabel: `معلم بارز • مديرية ${dist.name}`,
                        location: dist.name,
                        bgGradient: "from-emerald-950 via-sky-900 to-slate-900",
                      })
                    }
                    data={{
                      title: landmark,
                      category: `معلم بارز • ${dist.name}`,
                      description: `معلم بارز في مديرية ${dist.name}`,
                      location: dist.name,
                      bgGradient: "from-emerald-950 via-sky-900 to-slate-900",
                    }}
                  />
                ))}
          </div>
        </div>
      )}

      {/* TAB 5: ECONOMY & CROPS */}
      {activeSubTab === "economy" && (
        <div className="space-y-4">
          {dist.economyDetails && (
            <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
              {dist.economyDetails}
            </p>
          )}
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            أبرز المحاصيل والمنتجات الزراعية والحيوانية:
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {dist.cropsCardList && dist.cropsCardList.length > 0
              ? dist.cropsCardList.map((crop) => (
                  <UniversalCard
                    key={crop.id}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: crop.id,
                        title: crop.title,
                        subtitle: crop.subtitle,
                        fullBiography: crop.fullBiography || crop.description,
                        categoryLabel: `خيرات الأرض • مديرية ${dist.name}`,
                        location: dist.name,
                        bgGradient: crop.bgGradient,
                        images: crop.images,
                      })
                    }
                    data={{
                      title: crop.title,
                      category: `خيرات الأرض • ${dist.name}`,
                      description: crop.subtitle || crop.description,
                      location: dist.name,
                      bgGradient: crop.bgGradient,
                      images: crop.images,
                    }}
                  />
                ))
              : dist.crops.map((crop, idx) => (
                  <UniversalCard
                    key={idx}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: `crop-${idx}`,
                        title: crop,
                        subtitle: `محصول وثروة خصيبة في ${dist.name}`,
                        fullBiography: `${crop} ركن أساسي من الثروات والمحاصيل التي تعتز بها مديرية ${dist.name}.`,
                        categoryLabel: `خيرات الأرض • مديرية ${dist.name}`,
                        location: dist.name,
                        bgGradient: "from-emerald-950 via-slate-800 to-sky-900",
                      })
                    }
                    data={{
                      title: crop,
                      category: `خيرات الأرض • ${dist.name}`,
                      description: `محصول وثروة خصيبة في ${dist.name}`,
                      location: dist.name,
                      bgGradient: "from-emerald-950 via-slate-800 to-sky-900",
                    }}
                  />
                ))}
          </div>
        </div>
      )}

      {/* TAB 6: CULTURE & TRADITIONS */}
      {activeSubTab === "culture" && (
        <div className="space-y-4">
          {dist.traditionsAndCulture && (
            <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
              {dist.traditionsAndCulture}
            </p>
          )}
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            الفنون الشعبية وأصالة الموروث الأبيني:
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {dist.heritageCardList && dist.heritageCardList.length > 0
              ? dist.heritageCardList.map((item) => (
                  <UniversalCard
                    key={item.id}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: item.id,
                        title: item.title,
                        subtitle: item.subtitle,
                        fullBiography: item.fullBiography || item.description,
                        categoryLabel: `موروث وفلكلور • مديرية ${dist.name}`,
                        location: dist.name,
                        bgGradient: item.bgGradient,
                        images: item.images,
                      })
                    }
                    data={{
                      title: item.title,
                      category: `موروث وفلكلور • ${dist.name}`,
                      description: item.subtitle || item.description,
                      location: dist.name,
                      bgGradient: item.bgGradient,
                      images: item.images,
                    }}
                  />
                ))
              : dist.folkHeritage?.map((item, idx) => (
                  <UniversalCard
                    key={idx}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: `heritage-${idx}`,
                        title: item,
                        subtitle: `موروث وفلكلور أصيل في ${dist.name}`,
                        fullBiography: `${item} فن وموروث فلكلوري شفاهي يتوارثه أهالي مديرية ${dist.name}.`,
                        categoryLabel: `موروث وفلكلور • مديرية ${dist.name}`,
                        location: dist.name,
                        bgGradient: "from-sky-950 via-emerald-950 to-slate-900",
                      })
                    }
                    data={{
                      title: item,
                      category: `موروث وفلكلور • ${dist.name}`,
                      description: `موروث وفلكلور أصيل في ${dist.name}`,
                      location: dist.name,
                      bgGradient: "from-sky-950 via-emerald-950 to-slate-900",
                    }}
                  />
                ))}
          </div>
        </div>
      )}

      {activeSubTab === "villages" && (
        <div className="pt-1">
          <TagList
            title="أبرز القرى والبلدات والمناطق بالمديرية:"
            items={dist.villages}
            variant="pill"
            color="gradient"
          />
        </div>
      )}
    </div>
  );
}
