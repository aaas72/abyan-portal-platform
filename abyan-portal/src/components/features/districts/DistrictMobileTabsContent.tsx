import React from "react";
import { TagList } from "@/components/ui";
import UniversalCard from "@/components/cards/UniversalCard";
import { DistrictItem } from "@/types/schemas";
import RichTextRenderer from "@/components/ui/RichTextRenderer";

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
          {dist.description && (
            <RichTextRenderer content={dist.description} />
          )}
          {dist.historyOverview && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                النشأة والمسار التاريخي:
              </h4>
              <RichTextRenderer content={dist.historyOverview} />
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
          {!dist.description &&
            !dist.historyOverview &&
            (!dist.historyMilestones || dist.historyMilestones.length === 0) && (
              <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
                لا توجد معلومات أو أحداث تاريخية موثقة حالياً لهذه المديرية في قسم التاريخ والنشأة.
              </div>
            )}
        </div>
      )}

      {activeSubTab === "nature" && (
        <div className="space-y-3">
          {dist.geography ? (
            <div className="space-y-1.5">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                التضاريس والموقع الجغرافي:
              </h4>
              <RichTextRenderer content={dist.geography} />
            </div>
          ) : null}
          {dist.climateAndNature && (
            <div className="space-y-1.5 pt-1">
              <h4 className="font-abyan-title text-base sm:text-lg font-normal text-slate-900 block mb-2">
                المناخ والطبيعة البيئية:
              </h4>
              <RichTextRenderer content={dist.climateAndNature} />
            </div>
          )}
          {!dist.geography && !dist.climateAndNature && (
            <div className="py-8 text-center text-slate-500 font-abyan-body text-sm">
              لا توجد معلومات جغرافية أو تضاريس موثقة حالياً لهذه المديرية في قسم الجغرافيا والمناخ.
            </div>
          )}
        </div>
      )}

      {activeSubTab === "pioneers" && (
        <div className="space-y-4">
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none mb-2">
            أعلام وشخصيات المديرية الوطنية والتاريخية:
          </h4>
          {(dist.pioneersCardList && dist.pioneersCardList.length > 0) ||
          (dist.famousPioneers && dist.famousPioneers.length > 0) ? (
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
                          startYear: pioneer.startYear,
                          endYear: pioneer.endYear,
                          birthDate: pioneer.birthDate,
                          deathDate: pioneer.deathDate,
                          achievements: pioneer.achievements,
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
                          categoryLabel: "علم بالمديرية",
                          location: dist.name,
                          year: "رواد أبين",
                          bgGradient: "from-emerald-50 to-sky-50",
                        })
                      }
                      data={{
                        title: pioneer,
                        category: "علم بالمديرية",
                        subtitle: `رمز وعلم من أعلام مديرية ${dist.name}`,
                        description: `${pioneer} هو أحد أعمدة وشخصيات مديرية ${dist.name} البارزة في التاريخ والتراث الأبيني.`,
                        location: dist.name,
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
          {dist.sitesCardList && dist.sitesCardList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {dist.sitesCardList.map((site) => (
                <UniversalCard
                  key={site.id}
                  variant="food"
                  onClick={() =>
                    setSelectedMediaItem({
                      id: site.id,
                      title: site.title,
                      subtitle: site.subtitle,
                      fullBiography: site.fullBiography || site.description,
                      categoryLabel: "معلم أثري",
                      location: dist.name,
                      bgGradient: site.bgGradient,
                      images: site.images,
                    })
                  }
                  data={{
                    title: site.title,
                    category: "معلم أثري",
                    description: site.subtitle || site.description,
                    location: dist.name,
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
        <div className="space-y-4">
          {dist.economyDetails && (
            <RichTextRenderer content={dist.economyDetails} />
          )}
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            أبرز المحاصيل والمنتجات الزراعية والحيوانية:
          </h4>
          {dist.cropsCardList && dist.cropsCardList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {dist.cropsCardList.map((crop) => (
                <UniversalCard
                  key={crop.id}
                  variant="food"
                  onClick={() =>
                    setSelectedMediaItem({
                      id: crop.id,
                      title: crop.title,
                      subtitle: crop.subtitle,
                      fullBiography: crop.fullBiography || crop.description,
                      categoryLabel: "خيرات الأرض",
                      location: dist.name,
                      bgGradient: crop.bgGradient,
                      images: crop.images,
                    })
                  }
                  data={{
                    title: crop.title,
                    category: "خيرات الأرض",
                    description: crop.subtitle || crop.description,
                    location: dist.name,
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
        <div className="space-y-4">
          {dist.traditionsAndCulture && (
            <RichTextRenderer content={dist.traditionsAndCulture} />
          )}
          <h4 className="text-sm sm:text-base font-normal text-[#10b981] font-abyan-title block border-none">
            الفنون الشعبية وأصالة الموروث الأبيني:
          </h4>
          {(dist.heritageCardList && dist.heritageCardList.length > 0) ||
          (dist.folkHeritage && dist.folkHeritage.length > 0) ? (
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
                          categoryLabel: "موروث وفلكلور",
                          location: dist.name,
                          bgGradient: item.bgGradient,
                          images: item.images,
                        })
                      }
                      data={{
                        title: item.title,
                        category: "موروث وفلكلور",
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
                          categoryLabel: "موروث وفلكلور",
                          location: dist.name,
                          bgGradient: "from-sky-950 via-emerald-950 to-slate-900",
                        })
                      }
                      data={{
                        title: item,
                        category: "موروث وفلكلور",
                        description: `موروث وفلكلور أصيل في ${dist.name}`,
                        location: dist.name,
                        bgGradient: "from-sky-950 via-emerald-950 to-slate-900",
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
      )}

      {/* TAB 7: VILLAGES & TOWNS */}
      {activeSubTab === "villages" && (
        <div className="pt-1">
          {dist.villages && dist.villages.length > 0 ? (
            <TagList
              title="أبرز القرى والبلدات والمناطق بالمديرية:"
              items={dist.villages}
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
    </div>
  );
}
