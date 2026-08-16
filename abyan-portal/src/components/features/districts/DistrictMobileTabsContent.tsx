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

      {activeSubTab === "sites" && (
        <div className="space-y-3">
          <TagList
            title="أهم المعالم والحصون الأثرية:"
            items={dist.landmarks}
            variant="pure-text"
            color="emerald"
          />
          {dist.historicalSites && dist.historicalSites.length > 0 && (
            <div className="pt-2">
              <TagList
                title="الشواهد والقلاع التاريخية:"
                items={dist.historicalSites}
                variant="pure-text"
                color="sky"
              />
            </div>
          )}
        </div>
      )}

      {activeSubTab === "economy" && (
        <div className="space-y-3">
          {dist.economyDetails && (
            <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
              {dist.economyDetails}
            </p>
          )}
          <TagList
            title="أبرز المحاصيل والمنتجات الزواعية:"
            items={dist.crops}
            variant="pure-text"
            color="sky"
          />
          {dist.naturalResources && dist.naturalResources.length > 0 && (
            <div className="pt-2">
              <TagList
                title="الثروات والموارد الطبيعية:"
                items={dist.naturalResources}
                variant="pure-text"
                color="emerald"
              />
            </div>
          )}
        </div>
      )}

      {activeSubTab === "culture" && (
        <div className="space-y-3">
          {dist.traditionsAndCulture && (
            <p className="text-sm sm:text-base text-slate-800 font-abyan-body font-normal leading-relaxed">
              {dist.traditionsAndCulture}
            </p>
          )}
          {dist.folkHeritage && dist.folkHeritage.length > 0 && (
            <div className="pt-2">
              <TagList
                title="الفنون والموروث الشعبي بالمديرية:"
                items={dist.folkHeritage}
                variant="pure-text"
                color="emerald"
              />
            </div>
          )}
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
