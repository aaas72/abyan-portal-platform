import React from "react";
import { motion } from "framer-motion";
import { TagList } from "@/components/ui";
import UniversalCard from "@/components/cards/UniversalCard";
import { DistrictItem } from "@/types/schemas";
import { MediaItem } from "@/components/ui/UnifiedMediaViewer";
import { curtainOverlayVariants, curtainOverlayTransition } from "@/lib/animations";

type DistrictSubTab =
  | "history"
  | "nature"
  | "pioneers"
  | "sites"
  | "economy"
  | "culture"
  | "villages";

interface DistrictDesktopTabsContentProps {
  activeSubTab: DistrictSubTab;
  activeDistrict: DistrictItem;
  setSelectedMediaItem: (item: MediaItem | null) => void;
}

export default function DistrictDesktopTabsContent({
  activeSubTab,
  activeDistrict,
  setSelectedMediaItem,
}: DistrictDesktopTabsContentProps) {
  return (
    <motion.div
      key={activeSubTab}
      initial={curtainOverlayVariants.initial}
      animate={curtainOverlayVariants.animate}
      exit={curtainOverlayVariants.exit}
      transition={curtainOverlayTransition}
      className="space-y-5 pt-2"
    >
      {/* TAB 1: HISTORY & MILESTONES */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          <p className="text-sm sm:text-base lg:text-lg text-slate-800 font-abyan-body font-normal leading-relaxed">
            {activeDistrict.description}
          </p>
          {activeDistrict.historyOverview && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                النشأة والمسار التاريخي:
              </h4>
              <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
                {activeDistrict.historyOverview}
              </p>
            </div>
          )}
          {activeDistrict.historyMilestones &&
            activeDistrict.historyMilestones.length > 0 && (
              <div className="pt-2">
                <TagList
                  title="محطات وأحداث مفصلية في تاريخ المديرية:"
                  items={activeDistrict.historyMilestones}
                  variant="pure-text"
                  color="emerald"
                />
              </div>
            )}
        </div>
      )}

      {/* TAB 2: GEOGRAPHY & NATURE */}
      {activeSubTab === "nature" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
              التضاريس والموقع الجغرافي:
            </h4>
            <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
              {activeDistrict.geography}
            </p>
          </div>
          {activeDistrict.climateAndNature && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                المناخ والطبيعة البيئية:
              </h4>
              <p className="text-sm sm:text-base text-slate-700 font-abyan-body font-normal leading-relaxed">
                {activeDistrict.climateAndNature}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PIONEERS & FIGURES */}
      {activeSubTab === "pioneers" && (
        <div className="space-y-4">
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            أعلام وشخصيات المديرية الوطنية والتاريخية:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeDistrict.pioneersCardList &&
            activeDistrict.pioneersCardList.length > 0
              ? activeDistrict.pioneersCardList.map((pioneer) => (
                  <UniversalCard
                    key={pioneer.id}
                    variant="pioneer"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: pioneer.id,
                        title: pioneer.title,
                        subtitle: pioneer.subtitle,
                        authorName: pioneer.authorName || activeDistrict.authorName,
                        fullBiography:
                          pioneer.fullBiography || pioneer.description,
                        categoryLabel: pioneer.category || "رمز وطني وتاريخي",
                        location: pioneer.location || activeDistrict.name,
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
                      location: pioneer.location || activeDistrict.name,
                      authorName: pioneer.authorName || activeDistrict.authorName,
                      startYear: pioneer.startYear || "",
                      endYear: pioneer.endYear || "",
                      bgGradient: pioneer.bgGradient,
                      images: pioneer.images,
                    }}
                  />
                ))
              : activeDistrict.famousPioneers?.map((pioneer, idx) => (
                  <UniversalCard
                    key={idx}
                    variant="pioneer"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: `famous-${idx}`,
                        title: pioneer,
                        subtitle: `رمز وعلم من أعلام مديرية ${activeDistrict.name}`,
                        fullBiography: `${pioneer} هو أحد أعمدة وشخصيات مديرية ${activeDistrict.name} البارزة في التاريخ والتراث الأبيني.`,
                        categoryLabel: `علم بالمديرية • ${activeDistrict.name}`,
                        location: activeDistrict.name,
                        year: "رواد أبين",
                        bgGradient: "from-emerald-50 to-sky-50",
                      })
                    }
                    data={{
                      title: pioneer,
                      category: `علم بالمديرية • ${activeDistrict.name}`,
                      subtitle: `رمز وعلم من أعلام مديرية ${activeDistrict.name}`,
                      description: `${pioneer} هو أحد أعمدة وشخصيات مديرية ${activeDistrict.name} البارزة في التاريخ والتراث الأبيني.`,
                      location: activeDistrict.name,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeDistrict.sitesCardList &&
            activeDistrict.sitesCardList.length > 0
              ? activeDistrict.sitesCardList.map((site) => (
                  <UniversalCard
                    key={site.id}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: site.id,
                        title: site.title,
                        subtitle: site.subtitle,
                        fullBiography:
                          site.fullBiography || site.description,
                        categoryLabel: `معلم أثري • مديرية ${activeDistrict.name}`,
                        location: activeDistrict.name,
                        bgGradient: site.bgGradient,
                        images: site.images,
                      })
                    }
                    data={{
                      title: site.title,
                      category: `معلم أثري • ${activeDistrict.name}`,
                      description: site.subtitle || site.description,
                      location: activeDistrict.name,
                      bgGradient: site.bgGradient,
                      images: site.images,
                    }}
                  />
                ))
              : activeDistrict.landmarks.map((landmark, idx) => (
                  <UniversalCard
                    key={idx}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: `landmark-${idx}`,
                        title: landmark,
                        subtitle: `معلم بارز في مديرية ${activeDistrict.name}`,
                        fullBiography: `${landmark} أحد المعالم والشواهد الجغرافية والتاريخية البارزة في مديرية ${activeDistrict.name}.`,
                        categoryLabel: `معلم بارز • مديرية ${activeDistrict.name}`,
                        location: activeDistrict.name,
                        bgGradient:
                          "from-emerald-950 via-sky-900 to-slate-900",
                      })
                    }
                    data={{
                      title: landmark,
                      category: `معلم بارز • ${activeDistrict.name}`,
                      description: `معلم بارز في مديرية ${activeDistrict.name}`,
                      location: activeDistrict.name,
                      bgGradient:
                        "from-emerald-950 via-sky-900 to-slate-900",
                    }}
                  />
                ))}
          </div>
        </div>
      )}

      {/* TAB 5: ECONOMY & CROPS */}
      {activeSubTab === "economy" && (
        <div className="space-y-5">
          {activeDistrict.economyDetails && (
            <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
              {activeDistrict.economyDetails}
            </p>
          )}
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            أبرز المحاصيل والمنتجات الزراعية والحيوانية:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeDistrict.cropsCardList &&
            activeDistrict.cropsCardList.length > 0
              ? activeDistrict.cropsCardList.map((crop) => (
                  <UniversalCard
                    key={crop.id}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: crop.id,
                        title: crop.title,
                        subtitle: crop.subtitle,
                        fullBiography:
                          crop.fullBiography || crop.description,
                        categoryLabel: `خيرات الأرض • مديرية ${activeDistrict.name}`,
                        location: activeDistrict.name,
                        bgGradient: crop.bgGradient,
                        images: crop.images,
                      })
                    }
                    data={{
                      title: crop.title,
                      category: `خيرات الأرض • ${activeDistrict.name}`,
                      description: crop.subtitle || crop.description,
                      location: activeDistrict.name,
                      bgGradient: crop.bgGradient,
                      images: crop.images,
                    }}
                  />
                ))
              : activeDistrict.crops.map((crop, idx) => (
                  <UniversalCard
                    key={idx}
                    variant="food"
                    onClick={() =>
                      setSelectedMediaItem({
                        id: `crop-${idx}`,
                        title: crop,
                        subtitle: `محصول وثروة خصيبة في ${activeDistrict.name}`,
                        fullBiography: `${crop} ركن أساسي من الثروات والمحاصيل التي تعتز بها مديرية ${activeDistrict.name}.`,
                        categoryLabel: `خيرات الأرض • مديرية ${activeDistrict.name}`,
                        location: activeDistrict.name,
                        bgGradient:
                          "from-emerald-950 via-slate-800 to-sky-900",
                      })
                    }
                    data={{
                      title: crop,
                      category: `خيرات الأرض • ${activeDistrict.name}`,
                      description: `محصول وثروة خصيبة في ${activeDistrict.name}`,
                      location: activeDistrict.name,
                      bgGradient:
                        "from-emerald-950 via-slate-800 to-sky-900",
                    }}
                  />
                ))}
          </div>
        </div>
      )}

      {/* TAB 6: CULTURE & TRADITIONS */}
      {activeSubTab === "culture" && (
        <div className="space-y-5">
          {activeDistrict.traditionsAndCulture && (
            <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
              {activeDistrict.traditionsAndCulture}
            </p>
          )}
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
              الفنون الشعبية وأصالة الموروث الأبيني:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeDistrict.heritageCardList &&
              activeDistrict.heritageCardList.length > 0
                ? activeDistrict.heritageCardList.map((item) => (
                    <UniversalCard
                      key={item.id}
                      variant="food"
                      onClick={() =>
                        setSelectedMediaItem({
                          id: item.id,
                          title: item.title,
                          subtitle: item.subtitle,
                          fullBiography:
                            item.fullBiography || item.description,
                          categoryLabel: `موروث وفلكلور • مديرية ${activeDistrict.name}`,
                          location: activeDistrict.name,
                          bgGradient: item.bgGradient,
                          images: item.images,
                        })
                      }
                      data={{
                        title: item.title,
                        category: `موروث وفلكلور • ${activeDistrict.name}`,
                        description: item.subtitle || item.description,
                        location: activeDistrict.name,
                        bgGradient: item.bgGradient,
                        images: item.images,
                      }}
                    />
                  ))
                : activeDistrict.folkHeritage?.map((item, idx) => (
                    <UniversalCard
                      key={idx}
                      variant="food"
                      onClick={() =>
                        setSelectedMediaItem({
                          id: `heritage-${idx}`,
                          title: item,
                          subtitle: `موروث وفلكلور أصيل في ${activeDistrict.name}`,
                          fullBiography: `${item} فن وموروث فلكلوري شفاهي يتوارثه أهالي مديرية ${activeDistrict.name}.`,
                          categoryLabel: `موروث وفلكلور • مديرية ${activeDistrict.name}`,
                          location: activeDistrict.name,
                          bgGradient:
                            "from-sky-950 via-emerald-950 to-slate-900",
                        })
                      }
                      data={{
                        title: item,
                        category: `موروث وفلكلور • ${activeDistrict.name}`,
                        description: `موروث وفلكلور أصيل في ${activeDistrict.name}`,
                        location: activeDistrict.name,
                        bgGradient:
                          "from-sky-950 via-emerald-950 to-slate-900",
                      }}
                    />
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: VILLAGES & TOWNS */}
      {activeSubTab === "villages" && (
        <div className="pt-1">
          <TagList
            title="أبرز القرى والبلدات والمناطق بالمديرية:"
            items={activeDistrict.villages}
            variant="pill"
            color="gradient"
          />
        </div>
      )}
    </motion.div>
  );
}
