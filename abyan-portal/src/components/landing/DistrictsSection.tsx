"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SmartContainer from "@/components/layout/SmartContainer";
import {
  curtainOverlayVariants,
  curtainOverlayTransition,
  itemFadeInRight,
  sectionFadeUpVariants,
  subtleMicroHover,
} from "@/lib/animations";
import { DistrictItem } from "@/types/schemas";
import { AdminLandingSection } from "@/types/admin.types";

const MAP_GEOMETRY = [
// ... we will use AllowMultiple = false, so this doesn't need to match perfectly, wait I should use StartLine correctly

  { id: "zinjibar", searchKey: "زنجبار", pathD: "M260.361,255.28c-2.796-3.246-5.593-6.491-8.389-9.737-.549-1.099-1.099-2.197-1.648-3.296l1.798-1.798,16.403-7.565h11.085c-6.416,7.465-12.833,14.93-19.249,22.395Z", anchorX: 262, anchorY: 242, linePoints: "262,242 190,242", labelX: 178, labelY: 242, textAnchor: "start" as const, dy: "0" },
  { id: "khanfir", searchKey: "خنفر", pathD: "M279.611,161.281l-7.116,9.288-.599,5.842-12.733,5.992h-2.696l-1.198,3.595-13.931,5.992h-5.243l-.899,8.389-14.081,7.34-4.344,23.968-18.425,25.915-.899,8.838,4.194,7.939-.449,6.891h3.595l3.895-7.34,29.848-12.284,15.542-1.049c2.095-1.773,4.19-3.545,6.285-5.318-.975-1.159-1.949-2.319-2.924-3.478l-6.011-7.719-.983-1.531c.596-.58,1.192-1.161,1.788-1.741,3.886-1.928,7.773-3.857,11.659-5.785,1.469-.713,2.938-1.427,4.407-2.14,4.068-.357,8.135-.714,12.203-1.071,2.277-3.513,4.554-7.025,6.831-10.538l5.692-5.767,13.033-10.486,2.547-1.648s12.433-2.397,12.733-1.648c.3.749,11.535-3.595,11.535-3.595l8.988-.599,1.498-1.947,8.988-.749,2.547-2.397,12.134-.15,2.996-1.498,4.644-.3,3.895,1.648,9.887.15,3.558-1.648,4.045-.337,3.483,1.236,2.247-2.022,6.179.786,5.73-.899,11.684,1.011,9.1,1.685h6.629l5.955.225-4.691-1.522-14.286-26.898.758-16.548,1.648-3.033.874-2.769.459-2.701-.023-7.9h-31.346c-1.386,2.75-2.772,5.499-4.158,8.249-1.386,1.76-2.771,3.52-4.157,5.28-3.624,2.247-7.555,4.515-11.797,6.741-5.46,2.865-10.701,5.275-15.617,7.308-3.033.223-6.067.446-9.1.669-1.311,1.947-2.621,3.895-3.932,5.842-5.642,4.587-11.284,9.173-16.926,13.76-1.873-1.566-3.746-3.131-5.619-4.697-.899.749-1.798,1.498-2.696,2.247-1.698-1.098-3.396-2.197-5.093-3.295-1.529-2.952-3.058-5.905-4.587-8.857-1.872-1.673-3.745-3.346-5.617-5.018-2.172-.999-4.344-1.997-6.516-2.996l-14.231.112c-3.595,1.66-7.19,3.32-10.785,4.98Z", anchorX: 240, anchorY: 205, linePoints: "240,205 190,205", labelX: 178, labelY: 205, textAnchor: "start" as const, dy: "0" },
  { id: "sarar", searchKey: "سرار", pathD: "M237.834,147.49v2.472l-2.921,1.036-1.573,4.582-2.696,4.606-11.235,15.055v4.831l4.045,3.595,7.415,5.393-.112,2.359,5.337.571h5.243l13.931-5.992,1.198-3.595,3.155-.216,12.275-5.776.599-5.842,7.116-9.288.542-6.295.06-6.581-.412-3.624-.846-3.544-3.575-4.798-2.41-4.654-2.716-2.746-.811-1.865c-4.319,3.452-8.638,6.903-12.958,10.355-2.787,1.682-5.574,3.364-8.361,5.046-2.269,1.083-4.538,2.166-6.807,3.249-1.161.556-2.322,1.111-3.483,1.667Z", anchorX: 234, anchorY: 168, linePoints: "234,168 190,168", labelX: 178, labelY: 168, textAnchor: "start" as const, dy: "0" },
  { id: "rasad", searchKey: "رصد", pathD: "M232.938,146.47l5.168,1.404,8.435-4.543,9.989-5.838-.56-1.359-4.269-2.191-.899-1.685.056-3.202-1.854-2.528-2.078-1.629h-4.045l-1.461-1.798-1.18-1.741v-1.292h-8.033l-4.775,4.887,2.921,3.988c.112.671.225,1.342.337,2.012,1.142,1.108,2.284,2.216,3.427,3.324-.337.824-.674,1.648-1.011,2.472-2.565.487-5.131.974-7.696,1.461-1.891.169-3.782.337-5.674.506l-2.809,1.18v2.584l1.011,4.101,2.809,2.359h4.382l.506-2.528,7.303.056Z", anchorX: 244, anchorY: 136, linePoints: "244,136 190,136", labelX: 178, labelY: 136, textAnchor: "start" as const, dy: "0" },
  { id: "sibah", searchKey: "سباح", pathD: "M240.24,120.068c.056.514.113,1.028.169,1.541.824,1.097,1.648,2.193,2.471,3.29h4.045l3.663,3.79.213,3.569.899,1.685,3.936,2.02.893,1.531,20.255-16.614,1.187-5.739-.555-2.933-5.577-10.05-5.046-1.095-8.651.337-3.483-3.427-1.348,3.202-1.798-.506-3.258-1.348-3.033-1.348-3.427,1.404-1.067,2.977c.749,3.108,1.498,6.217,2.247,9.325,1.404,1.404,2.809,2.809,4.213,4.213l.041,1.344c-2.329.944-4.659,1.888-6.988,2.832Z", anchorX: 256, anchorY: 112, linePoints: "256,112 190,112", labelX: 178, labelY: 112, textAnchor: "start" as const, dy: "0" },
  { id: "lawdar", searchKey: "لودر", pathD: "M366.382,62.104l9.248-3.744,10.189-.142,4.081,4.41,1.428,2.269.563,3.483v3.835l.219,1.582,4.417,5.79-4.54.804-4.155.552-10.066,4.23-5.183,6.86-3.656,5.798.956,9.034,4.513,1.461.17,3.148-26.311,16.13-3.398,5.271.7,4.308-.7,4.728-3.642,1.872v2.547l1.423.749.749,1.498,5.806-.071,2.283,1.269,2.647,2.68.948,2.713.337,3.367-1.212,2.775-2.514,3.736-16.926,13.76-5.619-4.697-2.895,2.119-5.063-3.492-4.419-8.532-6.367-5.215-6.739-2.792-13.647.283-10.398,4.802.748-8.697-.225-6.404-1.18-4.943-4.269-5.73-2.097-4.551-3.146-2.584v-1.198l6.741-5.243,1.198-2.097.599-4.644-.599-3.165-5.543-9.868,3.146-1.348c1.217-.637,2.434-1.273,3.651-1.91,1.105.506,2.21,1.011,3.314,1.517,1.61.206,3.221.412,4.831.618,2.597,3.321,5.193,6.641,7.79,9.962,1.348,1.148,2.696,2.297,4.045,3.445.849-1.248,1.698-2.497,2.547-3.745,4.357-.337,8.713-.674,13.07-1.011,6.666-5.018,13.332-10.037,19.998-15.055,5.118-3.383,10.236-6.766,15.355-10.149,4.107-2.509,8.214-5.018,12.321-7.527-.175-3.57-.35-7.14-.524-10.711,1.667-1.379,3.333-2.759,5-4.138Z", anchorX: 342, anchorY: 110, linePoints: "342,110 290,110 290,35 270,35", labelX: 265, labelY: 35, textAnchor: "end" as const, dy: "-6" },
  { id: "jayshan", searchKey: "جيشان", pathD: "M369.229 61.364 L 375.932 58.218 L 385.819 58.218 L 390.645 62.712 L 391.511 65.482 L 392.111 70.053 L 392.111 73.798 L 395.856 78.591 L 402.497 78.204 L 410.296 73.875 L 419.113 68.98 L 420.872 68.405 L 431.789 43.838 L 428.83 39.943 L 423.119 31.105 L 422.52 28.558 L 412.184 21.817 L 401.248 21.817 L 374.134 37.546 Z", anchorX: 398, anchorY: 52, linePoints: "398,52 398,12", labelX: 398, labelY: 5, textAnchor: "middle" as const, dy: "-6" },
  { id: "wadea", searchKey: "الوضيع", pathD: "M373.797,112.025c5.518.265,11.036.53,16.554.795l6.123,4.382,4.045-.225-.075,13.978-4.551,8.633-4.034,5.064-27.124,13.287-9.662,1.049v-3.82s-.749-2.322-.824-2.547c-.075-.225-2.771-2.846-2.771-2.846l-1.947-1.273-6.142.075-.749-1.498-1.423-.749v-2.547l3.745-1.423c.824-.749.674-4.868.674-4.868l-1.049-4.194,3.67-5.692c8.514-5.193,17.027-10.386,25.541-15.579Z", anchorX: 365, anchorY: 128, linePoints: "365,128 365,215", labelX: 365, labelY: 215, textAnchor: "middle" as const, dy: "14" },
  { id: "mudiyah", searchKey: "مودية", pathD: "M419.113,68.98l28.206-3.498c-3.566,5.787-7.132,11.573-10.699,17.36v33.742c-1.635,4.79-3.271,9.581-4.906,14.371h-31.271c.025-4.659.05-9.319.075-13.978-1.348.075-2.696.15-4.045.225-2.041-1.461-4.082-2.921-6.123-4.382-5.243-.112-10.486-.225-15.729-.337l-.225-4.157c-1.504-.487-3.008-.974-4.513-1.461-.218-2.884-.437-5.767-.655-8.651.899-1.76,1.798-3.52,2.696-5.28,1.685-2.305,3.371-4.609,5.056-6.914,3.483-1.677,6.966-3.355,10.449-5.032,2.757-.298,5.716-.731,8.838-1.348,2.193-.434,4.271-.919,6.23-1.436,5.539-3.075,11.077-6.149,16.616-9.224Z", anchorX: 410, anchorY: 100, linePoints: "410,100 480,100 480,35 500,35", labelX: 505, labelY: 35, textAnchor: "start" as const, dy: "-6" },
  { id: "mahfad", searchKey: "المحفد", pathD: "M581.14,86.577c-.531-6.017-1.061-12.034-1.592-18.051l-8.464-2.547-4.569-4.194.393-17.63-1.723-2.247-1.498-.824h-2.472l-2.696.3-1.273.524-1.723,1.648-2.022,2.247-1.872,2.771-1.648,1.498-1.198,2.622v1.124l-1.798.15-2.247.225-4.569-4.344-12.134-.824-18.201-5.842-30.409,3.033-9.55,12.359-9.55,4.583-4.269,2.72h-3.82l-1.798-1.91-3.146.674-10.673,18.201v33.742l-4.831,14.371h11.385l12.761-2.019,33.301-5.115,8.447-6.226,3.957-1.042c3.955-3.413,7.911-6.826,11.866-10.24,8.825-5.262,17.649-10.524,26.474-15.786,6.817-.458,13.634-.917,20.451-1.375,6.903-.858,13.807-1.716,20.71-2.575Z", anchorX: 510, anchorY: 60, linePoints: "510,60 590,60 590,15 610,15", labelX: 615, labelY: 15, textAnchor: "start" as const, dy: "-6" },
  { id: "ahwar", searchKey: "أحور", pathD: "M586.832,157.77c-3.165-.025-6.329-.05-9.494-.075-2.834,1.785-5.667,3.57-8.501,5.355h-10.842c-3.046,1.361-6.092,2.721-9.138,4.082-3.321-.175-6.641-.35-9.962-.524-1.648,1.922-3.296,3.845-4.943,5.767h-3.67c-.974,1.723-1.947,3.445-2.921,5.168-10.336,4.07-20.672,8.139-31.009,12.209-1.386-.811-2.771-1.623-4.157-2.434-2.72-.138-5.44-.275-8.16-.413-1.025-.274-2.05-.548-3.075-.823-1.161.749-2.322,1.498-3.483,2.247-2.06.15-4.119.3-6.179.449-1.685.637-3.371,1.273-5.056,1.91-2.097.337-4.194.674-6.292,1.011-2.434.786-4.869,1.573-7.303,2.359-1.386-.187-2.771-.375-4.157-.562v-2.247c-1.872.187-3.745.375-5.617.562-4.681-9.138-9.363-18.276-14.044-27.413v-17.04c.549-1.011,1.099-2.022,1.648-3.033.449-1.423.899-2.846,1.348-4.269-.037-3.033-.075-6.067-.112-9.1h11.46c5.917-.936,11.834-1.873,17.751-2.809,9.363-1.386,18.725-2.771,28.088-4.157,2.921-2.21,5.842-4.419,8.763-6.629,1.236-.225,2.472-.449,3.708-.674,4.007-3.458,8.014-6.916,12.021-10.374,3.92-2.397,7.84-4.794,11.759-7.19,5.043-2.946,10.087-5.892,15.13-8.838,7.627-.587,15.255-1.173,22.882-1.76,5.955-.649,11.909-1.298,17.864-1.947.899,8.501,1.798,17.002,2.696,25.503.999,10.786,1.997,21.571,2.996,32.357v13.332Z", anchorX: 550, anchorY: 150, linePoints: "550,150 622,150", labelX: 630, labelY: 150, textAnchor: "end" as const, dy: "0" },
];

export default function DistrictsSection({ districts = [], sectionData }: { districts?: DistrictItem[], sectionData?: any }) {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);

  if (!districts || districts.length === 0) {
    return null;
  }

  const title = sectionData?.title || "التقسيم الإداري وجغرافيا أبين";
  const subtitle = sectionData?.subtitle || "استكشاف جغرافي تفاعلي يتتبع حدود ومعالم مديريات أبين من السواحل العريضة حتى القمم الجبلية الشامخة";

  const districtsData = districts.map(backendData => {
    const geometry = MAP_GEOMETRY.find(g => 
      g.id === backendData.id || backendData.name.includes(g.searchKey)
    );
    
    if (!geometry) return null;

    return {
      id: backendData.id,
      name: backendData.name, // required for SVG label
      displayName: backendData.name,
      category: backendData.regionLabel || "",
      capital: backendData.capital || "",
      crops: backendData.crops || [],
      landmarks: backendData.landmarks || [],
      description: backendData.description || "",
      pathD: geometry.pathD,
      anchorX: geometry.anchorX,
      anchorY: geometry.anchorY,
      linePoints: geometry.linePoints,
      labelX: geometry.labelX,
      labelY: geometry.labelY,
      textAnchor: geometry.textAnchor,
      dy: geometry.dy,
    };
  }).filter((d): d is NonNullable<typeof d> => d !== null);

  if (districtsData.length === 0) return null;

  const activeDistrict = districtsData.find((d) => d.id === selectedDistrictId) || districtsData[0];
  const activeSelectedId = selectedDistrictId || activeDistrict.id;

  return (
    <section
      id="districts"
      className="w-full bg-white border-none shadow-none relative overflow-hidden flex flex-col justify-center items-center cursor-default py-16 sm:py-24 lg:py-28"
    >
      <SmartContainer className="mb-4 lg:mb-6 w-full">
        <motion.div
          {...sectionFadeUpVariants}
          className="text-center space-y-1.5"
        >
          <h2 className="font-abyan-title text-2xl md:text-3xl lg:text-4xl text-slate-900 leading-normal font-normal">
            {title}
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto font-abyan-body font-normal leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </SmartContainer>

      <SmartContainer className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[480px] relative">
          <motion.div
            {...sectionFadeUpVariants}
            className="lg:col-span-8 relative flex flex-col items-center justify-center p-1"
          >
            <svg
              viewBox="40 -15 645 330"
              className="w-full h-auto max-h-[520px] sm:max-h-[600px] lg:max-h-[660px] drop-shadow-md select-none"
            >
              <filter id="mapGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0ea5e9" floodOpacity="0.2" />
              </filter>

              <g filter="url(#mapGlow)">
                <g id="map-shapes-base-layer">
                  {districtsData.map((district) => {
                    const isSelected = activeSelectedId === district.id;
                    const isHovered = hoveredDistrictId === district.id;

                    return (
                      <motion.path
                        key={district.id}
                        d={district.pathD}
                        onClick={() => setSelectedDistrictId(district.id)}
                        onMouseEnter={() => setHoveredDistrictId(district.id)}
                        onMouseLeave={() => setHoveredDistrictId(null)}
                        {...subtleMicroHover}
                        className={`cursor-pointer stroke-[1.4] origin-center ${
                          isSelected
                            ? "fill-[#0ea5e9] stroke-white"
                            : isHovered
                            ? "fill-[#38bdf8] stroke-white"
                            : "fill-[#10b981] stroke-white/80"
                        }`}
                      />
                    );
                  })}
                </g>

                <g id="map-callouts-top-layer">
                  {districtsData.map((district) => {
                    const isSelected = activeSelectedId === district.id;
                    const isHovered = hoveredDistrictId === district.id;

                    const pointsArr = district.linePoints.split(" ");
                    const lastPointStr = pointsArr[pointsArr.length - 1];
                    const [endX, endY] = lastPointStr.split(",").map(Number);

                    return (
                      <g key={`callout-${district.id}`} className="cursor-pointer">
                        <motion.circle
                          cx={district.anchorX}
                          cy={district.anchorY}
                          r={isSelected || isHovered ? 4 : 3}
                          onClick={() => setSelectedDistrictId(district.id)}
                          onMouseEnter={() => setHoveredDistrictId(district.id)}
                          onMouseLeave={() => setHoveredDistrictId(null)}
                          whileHover={{ scale: 1.3 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`cursor-pointer ${
                            isSelected
                              ? "fill-sky-500 stroke-white stroke-2"
                              : isHovered
                              ? "fill-sky-400 stroke-white stroke-2"
                              : "fill-slate-900 stroke-white stroke-[1.5]"
                          }`}
                        />

                        <motion.polyline
                          points={district.linePoints}
                          onClick={() => setSelectedDistrictId(district.id)}
                          onMouseEnter={() => setHoveredDistrictId(district.id)}
                          onMouseLeave={() => setHoveredDistrictId(null)}
                          className={`fill-none cursor-pointer ${
                            isSelected
                              ? "stroke-sky-600 stroke-[2.2px]"
                              : isHovered
                              ? "stroke-sky-500 stroke-[2px]"
                              : "stroke-slate-800 stroke-[1.4px]"
                          }`}
                          strokeDasharray={isSelected ? "none" : isHovered ? "4 2" : "3 2"}
                        />

                        <motion.circle
                          cx={endX}
                          cy={endY}
                          r={isSelected || isHovered ? 2.5 : 1.8}
                          onClick={() => setSelectedDistrictId(district.id)}
                          onMouseEnter={() => setHoveredDistrictId(district.id)}
                          onMouseLeave={() => setHoveredDistrictId(null)}
                          whileHover={{ scale: 1.25 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`cursor-pointer ${
                            isSelected ? "fill-sky-600" : isHovered ? "fill-sky-500" : "fill-slate-800"
                          }`}
                        />

                        <motion.text
                          x={district.labelX}
                          y={district.labelY}
                          dy={district.dy}
                          onClick={() => setSelectedDistrictId(district.id)}
                          onMouseEnter={() => setHoveredDistrictId(district.id)}
                          onMouseLeave={() => setHoveredDistrictId(null)}
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`font-abyan-title text-[11px] sm:text-[12.5px] font-normal cursor-pointer ${
                            isSelected
                              ? "fill-sky-700"
                              : isHovered
                              ? "fill-sky-600"
                              : "fill-slate-900"
                          }`}
                          textAnchor={district.textAnchor}
                          dominantBaseline={district.dy === "0" ? "middle" : "auto"}
                        >
                          {district.name}
                        </motion.text>
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
          </motion.div>

          <div className="lg:col-span-4 relative flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDistrict.id}
                initial={curtainOverlayVariants.initial}
                animate={curtainOverlayVariants.animate}
                exit={curtainOverlayVariants.exit}
                transition={curtainOverlayTransition}
                className="w-full space-y-3 py-6 px-6 sm:px-8 text-right bg-gradient-to-r from-transparent via-white/95 via-30% to-white shadow-none border-none backdrop-blur-none cursor-default"
              >
                <motion.span
                  {...itemFadeInRight(0.05)}
                  className="text-xs font-normal text-sky-600 font-abyan-title block"
                >
                  {activeDistrict.category}
                </motion.span>

                <motion.span
                  {...itemFadeInRight(0.08)}
                  className="font-abyan-title text-[#10b981] text-base md:text-lg block font-normal"
                >
                  المركز الإداري: {activeDistrict.capital}
                </motion.span>
                <div className="mb-8">
                <motion.h3
                  {...itemFadeInRight(0.12)}
                  className="text-2xl md:text-3xl lg:text-4xl font-abyan-title text-slate-900 mb-2"
                >
                  مديرية <span className="text-sky-600">{activeDistrict.displayName}</span>
                </motion.h3>

                {activeDistrict.description ? (
                  <motion.p
                    {...itemFadeInRight(0.16)}
                    className="text-sm md:text-base text-slate-700 font-abyan-body font-normal leading-relaxed pt-0.5 max-w-2xl"
                  >
                    {activeDistrict.description}
                  </motion.p>
                ) : (
                  <motion.p
                    {...itemFadeInRight(0.16)}
                    className="text-sm md:text-base text-slate-400 font-abyan-body font-normal leading-relaxed pt-0.5 max-w-2xl italic"
                  >
                    تفاصيل هذه المديرية لم تتوفر بعد.
                  </motion.p>
                )}
                </div>

                <motion.div
                  {...itemFadeInRight(0.2)}
                  className="pt-2 space-y-1"
                >
                  <span className="text-xs text-slate-900 font-abyan-title font-normal block">
                    المحاصيل والخيرات الإنتاجية:
                  </span>
                  <p className="text-sm md:text-base text-sky-600 font-abyan-body font-normal leading-relaxed">
                    {activeDistrict.crops.length > 0 ? activeDistrict.crops.join(" • ") : "غير محددة"}
                  </p>
                </motion.div>

                <motion.div
                  {...itemFadeInRight(0.24)}
                  className="pt-1 space-y-1"
                >
                  <span className="text-xs text-slate-900 font-abyan-title font-normal block">
                    أبرز المعالم والجغرافيا:
                  </span>
                  <p className="text-sm md:text-base text-sky-600 font-abyan-body font-normal leading-relaxed">
                    {activeDistrict.landmarks.length > 0 ? activeDistrict.landmarks.join(" • ") : "غير محددة"}
                  </p>
                </motion.div>

                <motion.div
                  {...itemFadeInRight(0.28)}
                  className="pt-3"
                >
                  <Link
                    href={`/districts?id=${activeDistrict.id}`}
                    className="inline-flex items-center text-sm md:text-base font-normal text-sky-600 hover:text-[#10b981] font-abyan-title transition-colors no-underline cursor-pointer group"
                  >
                    استكشف المزيد عن مديرية {activeDistrict.displayName}
                    <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">←</span>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SmartContainer>
    </section>
  );
}
