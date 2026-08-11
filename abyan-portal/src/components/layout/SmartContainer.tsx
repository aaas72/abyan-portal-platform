"use client";

import React from "react";

interface SmartContainerProps {
  children: React.ReactNode;
  /** كلاسات مخصصة لغلاف القسم الخارجي الذي يتمدد بعرض الشاشة الكامل (لصالح الخلفيات والمؤثرات) */
  bgClassName?: string;
  /** كلاسات مخصصة للحاوية الداخلية الذكية التي تحصر النصوص والصور والمعالم */
  className?: string;
  /** تحديد أقصى عرض للحاوية الداخلية (افتراضياً max-w-6xl) */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "6xl" | "7xl" | "full";
  /** معرّف القسم */
  id?: string;
}

export default function SmartContainer({
  children,
  bgClassName = "",
  className = "",
  maxWidth = "6xl",
  id,
}: SmartContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-3xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <section
      id={id}
      className={`w-full relative overflow-hidden transition-all ${bgClassName}`}
    >
      {/* الحاوية الداخلية الذكية بحجم max-w-6xl */}
      <div
        className={`w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
