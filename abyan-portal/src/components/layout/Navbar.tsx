
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SmartContainer from "./SmartContainer";
import {
  navbarFadeDown,
  subtleMicroHover,
  drawerSlideRightVariants,
  drawerSlideRightTransition,
} from "@/lib/animations";

interface NavbarProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navSections = [
    { id: "history", label: "التاريخ", href: "/history" },
    { id: "culture", label: "الثقافة", href: "/culture" },
    { id: "districts", label: "المديريات", href: "/districts" },
    { id: "landmarks", label: "المعالم والبيئة", href: "/landmarks" },
    { id: "economy", label: "الاقتصاد", href: "/economy" },
    { id: "pioneers", label: "الأعلام", href: "/pioneers" },
    { id: "gallery", label: "الأرشيف", href: "/gallery" },
  ];

  return (
    <>
      <motion.header
        {...navbarFadeDown}
        className="absolute top-6 sm:top-8 lg:top-10 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 z-30 h-auto bg-transparent border-none shadow-none flex items-start pt-3 sm:pt-4 lg:pt-5 overflow-visible pointer-events-none"
      >
        <SmartContainer className="flex items-start justify-between overflow-visible pointer-events-auto w-full">
          {/* Right Side: Brand Title "بوابة أبين" */}
          <Link href="/" className="no-underline">
            <motion.h1
              {...subtleMicroHover}
              className={`font-abyan-title text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-none py-0 overflow-visible drop-shadow-md cursor-pointer ${
                isHomePage ? "text-white" : "text-slate-900"
              }`}
            >
              بوابة أبين
            </motion.h1>
          </Link>

          {/* Left Side (Desktop & Tablet): Horizontal Navigation Links */}
          <nav className="hidden md:flex items-center gap-3 sm:gap-4 lg:gap-6 pt-2">
            {navSections.map((sec) => {
              const currentPath = (pathname || "").replace(/\/$/, "");
              const targetPath = (sec.href || "").replace(/\/$/, "");
              const isActive =
                currentPath === targetPath ||
                (targetPath !== "" && currentPath.startsWith(targetPath));

              return (
                <Link key={sec.id} href={sec.href} className="no-underline">
                  <motion.span
                    whileHover={{ scale: 1.05, color: "#10b981" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`font-abyan-title text-sm md:text-base lg:text-lg transition-colors cursor-pointer drop-shadow-sm font-normal block ${
                      isActive
                        ? "text-[#10b981] font-normal opacity-100"
                        : isHomePage
                          ? "text-white/95 hover:text-white font-normal"
                          : "text-slate-700 hover:text-sky-600 font-normal"
                    }`}
                  >
                    {sec.label}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Left Side (Mobile Only): Drawer Hamburger Menu Trigger */}
          <div className="flex md:hidden items-center pt-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open navigation menu"
              className={`font-abyan-title text-base sm:text-lg font-normal bg-transparent border-none cursor-pointer drop-shadow-md ${
                isHomePage ? "text-white" : "text-slate-900"
              }`}
            >
              القائمة
            </button>
          </div>
        </SmartContainer>
      </motion.header>

      {/* Responsive Mobile Side Curtain Drawer (Slides from/to Right) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
            />

            {/* Right Side Sliding Curtain Panel in Spring Green Theme */}
            <motion.div
              initial={drawerSlideRightVariants.initial}
              animate={drawerSlideRightVariants.animate}
              exit={drawerSlideRightVariants.exit}
              transition={drawerSlideRightTransition}
              className="fixed top-0 bottom-0 right-0 z-50 w-[80vw] max-w-xs bg-gradient-to-b from-[#10b981] via-[#059669] to-[#047857] text-white p-6 sm:p-8 flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="space-y-8 text-right w-full">
                {/* Header Row in Drawer: Logo Right + Close Button Left */}
                <div className="flex items-center justify-between border-b border-white/20 pb-5 text-right">
                  <h2 className="font-abyan-title text-3xl md:text-4xl text-white font-normal">
                    بوابة أبين
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="font-abyan-title text-lg md:text-xl text-white/90 hover:text-white bg-transparent border-none cursor-pointer p-1 font-normal"
                  >
                    إغلاق
                  </button>
                </div>

                {/* Vertical Links List */}
                <nav className="flex flex-col space-y-5">
                  {navSections.map((sec) => {
                    const currentPath = (pathname || "").replace(/\/$/, "");
                    const targetPath = (sec.href || "").replace(/\/$/, "");
                    const isActive =
                      currentPath === targetPath ||
                      (targetPath !== "" && currentPath.startsWith(targetPath));

                    return (
                      <Link
                        key={sec.id}
                        href={sec.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="no-underline"
                      >
                        <span
                          className={`font-abyan-title text-lg md:text-xl font-normal transition-colors block ${
                            isActive
                              ? "text-amber-200 font-medium"
                              : "text-white/90 hover:text-white"
                          }`}
                        >
                          {sec.label}
                        </span>
                      </Link>
                    );
                  })}
                  
                  {/* Extra Pages (Mobile Only) */}
                  <div className="pt-4 mt-2 border-t border-white/20">
                    <Link
                      href="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="no-underline block mb-4"
                    >
                      <span className={`font-abyan-title text-lg md:text-xl font-normal transition-colors block ${
                        (pathname || "").replace(/\/$/, "") === "/about" ? "text-amber-200 font-medium" : "text-white/90 hover:text-white"
                      }`}>
                        عن المنصة
                      </span>
                    </Link>
                    <Link
                      href="/copyright"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="no-underline block mb-4"
                    >
                      <span className={`font-abyan-title text-lg md:text-xl font-normal transition-colors block ${
                        (pathname || "").replace(/\/$/, "") === "/copyright" ? "text-amber-200 font-medium" : "text-white/90 hover:text-white"
                      }`}>
                        شروط الاستخدام وحماية الحقوق
                      </span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="no-underline block"
                    >
                      <span className={`font-abyan-title text-lg md:text-xl font-normal transition-colors block ${
                        (pathname || "").replace(/\/$/, "") === "/contact" ? "text-amber-200 font-medium" : "text-white/90 hover:text-white"
                      }`}>
                        تواصل معنا
                      </span>
                    </Link>
                  </div>
                </nav>
              </div>

              {/* Bottom Drawer Footer Tag */}
              <div className="pt-6 border-t border-white/20 text-right">
                <span className="font-abyan-title text-sm text-sky-200 font-normal block">
                  بوابة أبين الثقافية
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
