import React from "react";
import { motion } from "framer-motion";
import { DistrictItem } from "@/types/schemas";

interface DistrictDesktopSidebarProps {
  filteredDistricts: DistrictItem[];
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;
}

export default function DistrictDesktopSidebar({
  filteredDistricts,
  selectedDistrictId,
  setSelectedDistrictId,
}: DistrictDesktopSidebarProps) {
  return (
    <div className="w-[270px] shrink-0 space-y-3">
      <span className="text-xs font-normal text-slate-900 font-abyan-title block text-right mb-2">
        اختر المديرية للاستعراض الموسوعي الشامل:
      </span>

      <div className="grid grid-cols-1 gap-1.5 border-r border-slate-100 pr-3">
        {filteredDistricts.map((dist) => {
          const isSelected = selectedDistrictId === dist.id;

          return (
            <motion.div
              key={dist.id}
              onClick={() => setSelectedDistrictId(dist.id)}
              className="py-3 px-1 text-right cursor-pointer bg-transparent border-b border-slate-100 last:border-none shadow-none transition-colors duration-300"
            >
              <h3
                className={`font-abyan-title text-base font-normal leading-snug transition-colors duration-300 ${
                  isSelected
                    ? "text-sky-600 font-medium"
                    : "text-slate-900 hover:text-sky-600"
                }`}
              >
                مديرية {dist.name}
              </h3>
              <p className="text-xs text-slate-500 font-abyan-body font-normal truncate pt-0.5">
                {dist.title}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
