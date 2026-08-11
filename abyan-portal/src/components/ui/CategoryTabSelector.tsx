"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import SmartContainer from "@/components/layout/SmartContainer";
import { sectionFadeUpVariants, subtleMicroHover } from "@/lib/animations";

export interface TabItem {
  id: string;
  label: string;
}

interface CategoryTabSelectorProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  size?: "sm" | "md";
  noContainer?: boolean;
  className?: string;
}

export default function CategoryTabSelector({
  tabs,
  activeTab,
  onSelectTab,
  size = "md",
  noContainer = false,
  className = "",
}: CategoryTabSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 4) {
      setCanScrollRight(false);
      setCanScrollLeft(false);
      return;
    }

    const currentScroll = Math.abs(scrollLeft);
    setCanScrollRight(currentScroll > 4);
    setCanScrollLeft(currentScroll < maxScroll - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
    }
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [tabs]);

  // Auto-scroll active tab into center view
  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setTimeout(checkScroll, 350);
    }
  }, [activeTab]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "right" ? 220 : -220;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(checkScroll, 250);
  };

  const startContinuousScroll = (direction: "left" | "right") => {
    handleScroll(direction);
    stopContinuousScroll();
    scrollIntervalRef.current = setInterval(() => {
      handleScroll(direction);
    }, 160);
  };

  const stopContinuousScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const tabItems = tabs.map((tab) => {
    const isActive = activeTab === tab.id;

    return (
      <motion.button
        key={tab.id}
        ref={isActive ? activeTabRef : null}
        onClick={() => onSelectTab(tab.id)}
        {...subtleMicroHover}
        className={`font-abyan-title font-normal bg-transparent border-none px-2 cursor-pointer whitespace-nowrap shrink-0 transition-colors duration-300 leading-normal ${
          size === "sm"
            ? "text-xs sm:text-sm"
            : "text-xs sm:text-sm lg:text-base"
        } ${
          isActive
            ? "text-[#10b981] font-medium"
            : "text-slate-700 hover:text-sky-600"
        }`}
      >
        {tab.label}
      </motion.button>
    );
  });

  const rowClasses = `flex overflow-x-auto no-scrollbar flex-nowrap items-center w-full px-2 ${
    size === "sm"
      ? "justify-start gap-4 sm:gap-5 py-0.5"
      : "justify-start gap-5 sm:gap-6 py-1"
  }`;

  const content = (
    <div className={`relative flex items-center justify-start w-full gap-1.5 sm:gap-2 ${className}`}>
      {/* Right Bracket Controller (RTL Start Side - Right) */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        onMouseDown={() => startContinuousScroll("right")}
        onMouseUp={stopContinuousScroll}
        onMouseLeave={stopContinuousScroll}
        onTouchStart={() => startContinuousScroll("right")}
        onTouchEnd={stopContinuousScroll}
        aria-label="متحكم التمرير نحو اليمين"
        className={`font-abyan-title leading-none text-sm sm:text-base lg:text-lg font-bold bg-transparent border-none p-0 shrink-0 transition-all duration-300 select-none cursor-pointer pointer-events-auto active:scale-95 ${
          canScrollRight
            ? "text-[#10b981] hover:text-sky-600 opacity-100"
            : "text-slate-400 hover:text-[#10b981] opacity-40"
        }`}
      >
        «
      </button>

      {/* Scrollable Tabs Track */}
      <div
        ref={scrollRef}
        className={rowClasses}
      >
        {tabItems}
      </div>

      {/* Left Bracket Controller (RTL End Side - Left) */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        onMouseDown={() => startContinuousScroll("left")}
        onMouseUp={stopContinuousScroll}
        onMouseLeave={stopContinuousScroll}
        onTouchStart={() => startContinuousScroll("left")}
        onTouchEnd={stopContinuousScroll}
        aria-label="متحكم التمرير نحو اليسار"
        className={`font-abyan-title leading-none text-sm sm:text-base lg:text-lg font-bold bg-transparent border-none p-0 shrink-0 transition-all duration-300 select-none cursor-pointer pointer-events-auto active:scale-95 ${
          canScrollLeft
            ? "text-[#10b981] hover:text-sky-600 opacity-100"
            : "text-slate-400 hover:text-[#10b981] opacity-40"
        }`}
      >
        »
      </button>
    </div>
  );

  if (noContainer) {
    return content;
  }

  return (
    <SmartContainer className="mb-10">
      <motion.div {...sectionFadeUpVariants}>
        {content}
      </motion.div>
    </SmartContainer>
  );
}
