import React from "react";
import { motion } from "framer-motion";
import { TagList } from "@/components/ui";
import UniversalCard from "@/components/cards/UniversalCard";
import { DistrictItem } from "@/types/schemas";
import { MediaItem } from "@/components/ui/UnifiedMediaViewer";
import { curtainOverlayVariants, curtainOverlayTransition } from "@/lib/animations";
import RichTextRenderer from "@/components/ui/RichTextRenderer";

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
          {activeDistrict.description && (
            <RichTextRenderer content={activeDistrict.description} />
          )}
          {activeDistrict.historyOverview && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                النشأة والمسار التاريخي:
              </h4>
              <RichTextRenderer content={activeDistrict.historyOverview} />
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
          {!activeDistrict.description &&
            !activeDistrict.historyOverview &&
            (!activeDistrict.historyMilestones ||
              activeDistrict.historyMilestones.length === 0) && (
              <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
                لا توجد معلومات أو أحداث تاريخية موثقة حالياً لهذه المديرية في قسم التاريخ والنشأة.
              </div>
            )}
        </div>
      )}

      {/* TAB 2: GEOGRAPHY & NATURE */}
      {activeSubTab === "nature" && (
        <div className="space-y-4">
          {activeDistrict.geography ? (
            <div className="space-y-1.5">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                التضاريس والموقع الجغرافي:
              </h4>
              <RichTextRenderer content={activeDistrict.geography} />
            </div>
          ) : null}
          {activeDistrict.climateAndNature && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                المناخ والطبيعة البيئية:
              </h4>
              <RichTextRenderer content={activeDistrict.climateAndNature} />
            </div>
          )}
          {!activeDistrict.geography && !activeDistrict.climateAndNature && (
            <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
              لا توجد معلومات جغرافية أو تضاريس موثقة حالياً لهذه المديرية في قسم الجغرافيا والمناخ.
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
          {(activeDistrict.pioneersCardList &&
            activeDistrict.pioneersCardList.length > 0) ||
          (activeDistrict.famousPioneers &&
            activeDistrict.famousPioneers.length > 0) ? (
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
                          authorName:
                            pioneer.authorName || activeDistrict.authorName,
                          fullBiography:
                            pioneer.fullBiography || pioneer.description,
                          categoryLabel: pioneer.category || "رمز وطني وتاريخي",
                          location: pioneer.location || activeDistrict.name,
                          startYear: pioneer.startYear,
                          endYear: pioneer.endYear,
                          birthDate: pioneer.birthDate,
                          deathDate: pioneer.deathDate,
                          achievements: pioneer.achievements,
                          year: `${pioneer.startYear || ""}\u00A0\u00A0-\u00A0\u00A0${pioneer.endYear || ""}`,
                          sources: pioneer.sources || activeDistrict.sources,
                          sourceName:
                            pioneer.sourceName || activeDistrict.sourceName,
                          sourceUrl:
                            pioneer.sourceUrl || activeDistrict.sourceUrl,
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
                        authorName:
                          pioneer.authorName || activeDistrict.authorName,
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
                          categoryLabel: "علم بالمديرية",
                          location: activeDistrict.name,
                          year: "رواد أبين",
                          bgGradient: "from-emerald-50 to-sky-50",
                        })
                      }
                      data={{
                        title: pioneer,
                        category: "علم بالمديرية",
                        subtitle: `رمز وعلم من أعلام مديرية ${activeDistrict.name}`,
                        description: `${pioneer} هو أحد أعمدة وشخصيات مديرية ${activeDistrict.name} البارزة في التاريخ والتراث الأبيني.`,
                        location: activeDistrict.name,
                        era: "رواد أبين",
                        bgGradient: "from-emerald-50 to-sky-50",
                      }}
                    />
                  ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
              لا توجد أعلام أو شخصيات موثقة حالياً لهذه المديرية في قسم الأعلام والشخصيات.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SITES & LANDMARKS */}
      {activeSubTab === "sites" && (
        <div className="space-y-4">
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            الشواهد والمعالم والحصون الأثرية بالمديرية:
          </h4>
          {activeDistrict.sitesCardList &&
          activeDistrict.sitesCardList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeDistrict.sitesCardList.map((site) => (
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
                      categoryLabel: "معلم أثري",
                      location: activeDistrict.name,
                      authorName: site.authorName || activeDistrict.authorName,
                      sources: site.sources || activeDistrict.sources,
                      sourceName: site.sourceName || activeDistrict.sourceName,
                      sourceUrl: site.sourceUrl || activeDistrict.sourceUrl,
                      bgGradient: site.bgGradient,
                      images: site.images,
                    })
                  }
                  data={{
                    title: site.title,
                    category: "معلم أثري",
                    description: site.subtitle || site.description,
                    location: activeDistrict.name,
                    bgGradient: site.bgGradient,
                    images: site.images,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
              لا توجد معالم أو شواهد أثرية موثقة حالياً لهذه المديرية في قسم المعالم والآثار.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ECONOMY & CROPS */}
      {activeSubTab === "economy" && (
        <div className="space-y-5">
          {activeDistrict.economyDetails && (
            <RichTextRenderer content={activeDistrict.economyDetails} />
          )}
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            أبرز المحاصيل والمنتجات الزراعية والحيوانية:
          </h4>
          {activeDistrict.cropsCardList &&
          activeDistrict.cropsCardList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeDistrict.cropsCardList.map((crop) => (
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
                      categoryLabel: "خيرات الأرض",
                      location: activeDistrict.name,
                      authorName: crop.authorName || activeDistrict.authorName,
                      sources: crop.sources || activeDistrict.sources,
                      sourceName: crop.sourceName || activeDistrict.sourceName,
                      sourceUrl: crop.sourceUrl || activeDistrict.sourceUrl,
                      bgGradient: crop.bgGradient,
                      images: crop.images,
                    })
                  }
                  data={{
                    title: crop.title,
                    category: "خيرات الأرض",
                    description: crop.subtitle || crop.description,
                    location: activeDistrict.name,
                    bgGradient: crop.bgGradient,
                    images: crop.images,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
              لا توجد محاصيل أو ثروات زراعية موثقة حالياً لهذه المديرية في قسم الاقتصاد والزراعة.
            </div>
          )}
        </div>
      )}

      {/* TAB 6: CULTURE & TRADITIONS */}
      {activeSubTab === "culture" && (
        <div className="space-y-5">
          {activeDistrict.traditionsAndCulture && (
            <RichTextRenderer content={activeDistrict.traditionsAndCulture} />
          )}
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
              الفنون الشعبية وأصالة الموروث الأبيني:
            </h4>
            {(activeDistrict.heritageCardList &&
              activeDistrict.heritageCardList.length > 0) ||
            (activeDistrict.folkHeritage &&
              activeDistrict.folkHeritage.length > 0) ? (
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
                            categoryLabel: "موروث وفلكلور",
                            location: activeDistrict.name,
                            authorName:
                              item.authorName || activeDistrict.authorName,
                            sources: item.sources || activeDistrict.sources,
                            sourceName:
                              item.sourceName || activeDistrict.sourceName,
                            sourceUrl:
                              item.sourceUrl || activeDistrict.sourceUrl,
                            bgGradient: item.bgGradient,
                            images: item.images,
                          })
                        }
                        data={{
                          title: item.title,
                          category: "موروث وفلكلور",
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
                            categoryLabel: "موروث وفلكلور",
                            location: activeDistrict.name,
                            authorName: activeDistrict.authorName,
                            sources: activeDistrict.sources,
                            sourceName: activeDistrict.sourceName,
                            sourceUrl: activeDistrict.sourceUrl,
                            bgGradient:
                              "from-sky-950 via-emerald-950 to-slate-900",
                          })
                        }
                        data={{
                          title: item,
                          category: "موروث وفلكلور",
                          description: `موروث وفلكلور أصيل في ${activeDistrict.name}`,
                          location: activeDistrict.name,
                          bgGradient:
                            "from-sky-950 via-emerald-950 to-slate-900",
                        }}
                      />
                    ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
                لا توجد فنون أو موروثات شعبية موثقة حالياً لهذه المديرية في قسم الثقافة والموروث.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: VILLAGES & TOWNS */}
      {activeSubTab === "villages" && (
        <div className="pt-1">
          {activeDistrict.villages && activeDistrict.villages.length > 0 ? (
            <TagList
              title="أبرز القرى والبلدات والمناطق بالمديرية:"
              items={activeDistrict.villages}
              variant="pill"
              color="gradient"
            />
          ) : (
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
                أبرز القرى والبلدات والمناطق بالمديرية:
              </h4>
              <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
                لا توجد قرى أو بلدات موثقة حالياً لهذه المديرية في قسم القرى والبلدات.
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
