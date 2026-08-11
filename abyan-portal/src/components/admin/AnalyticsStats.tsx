"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/services/api/api.client";
import UniversalCard from "@/components/cards/UniversalCard";

interface AnalyticsStat {
  section: string;
  totalVisits: number;
  uniqueVisitorsCount: number;
}

interface TopEntityStat {
  entityId: string;
  entityName: string;
  section: string;
  totalVisits: number;
  uniqueVisitorsCount: number;
}

const sectionNames: Record<string, string> = {
  pioneers: "الأعلام والشخصيات",
  landmarks: "المعالم والحصون",
  districts: "المديريات",
  history: "التاريخ والحقب",
  culture: "الموروث الثقافي",
  economy: "الاقتصاد",
  gallery: "الأرشيف البصري",
  about: "عن البوابة",
  home: "الصفحة الرئيسية",
};

export default function AnalyticsStats() {
  const [stats, setStats] = useState<AnalyticsStat[]>([]);
  const [topEntities, setTopEntities] = useState<TopEntityStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, topRes] = await Promise.all([
          apiClient.get("/analytics/stats"),
          apiClient.get("/analytics/top-entities"),
        ]);

        if (statsRes.data?.success) {
          setStats(statsRes.data.data);
        }
        if (topRes.data?.success) {
          setTopEntities(topRes.data.data);
        }
      } catch (err) {
        setError("تعذر تحميل إحصائيات الزيارات");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-abyan-body text-sm">
        {error}
      </div>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-3 pb-4">
        <h2 className="font-abyan-title text-2xl text-slate-900">
          إحصائيات الزيارات (تتبع الزوار الفريدين)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 transition-colors duration-300"
          >
            <h3 className="font-abyan-title text-lg text-slate-800 mb-4">
              {sectionNames[stat.section] || stat.section}
            </h3>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="font-abyan-body text-xs text-slate-500 mb-1">
                  الزوار الفريدين
                </span>
                <span className="font-abyan-title text-2xl text-emerald-500">
                  {stat.uniqueVisitorsCount}
                </span>
              </div>

              <div className="w-[1px] h-10 bg-slate-100 mx-4"></div>

              <div className="flex flex-col text-left">
                <span className="font-abyan-body text-xs text-slate-500 mb-1">
                  إجمالي التصفح
                </span>
                <span className="font-abyan-title text-xl text-slate-700">
                  {stat.totalVisits}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topEntities.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <h2 className="font-abyan-title text-2xl text-slate-900">
              المحتوى الأكثر مشاهدة (التريند)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {topEntities.map((entity, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-500 transition-colors duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-8 h-8 bg-slate-50 flex items-center justify-center rounded-bl-2xl text-slate-400 font-bold group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  #{idx + 1}
                </div>

                <h3
                  className="font-abyan-body font-bold text-sm text-slate-800 mb-1 mt-2 line-clamp-1"
                  title={entity.entityName || entity.entityId}
                >
                  {entity.entityName || entity.entityId}
                </h3>
                <span className="font-abyan-body text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md mb-4 inline-block">
                  {sectionNames[entity.section] || entity.section}
                </span>

                <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="font-abyan-body text-[10px] text-slate-400">
                      الزوار الفريدين
                    </span>
                    <span className="font-abyan-title text-lg text-emerald-500">
                      {entity.uniqueVisitorsCount}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-abyan-body text-[10px] text-slate-400">
                      مشاهدات
                    </span>
                    <span className="font-abyan-title text-base text-slate-600">
                      {entity.totalVisits}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
