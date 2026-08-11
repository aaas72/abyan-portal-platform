/**
 * Unified Global Animation System for Abyan Cultural Portal
 * نظام ومثبتات الأنيميشن الموحدة والمحسّنة لبوابة أبين الثقافية
 */

import { Transition } from "framer-motion";

export const UNIFIED_EASING = [0.16, 1, 0.3, 1] as const;

// 1. التراكب وانزلاق الستارة الموحد (Curtain Slide Overlay Animation)
export const curtainOverlayVariants = {
  initial: { clipPath: "inset(0 0 0 100%)", opacity: 0 },
  animate: { clipPath: "inset(0 0 0 0)", opacity: 1 },
  exit: { clipPath: "inset(0 0 0 100%)", opacity: 0 },
};

export const curtainOverlayTransition: Transition = {
  clipPath: { duration: 0.42, ease: UNIFIED_EASING },
  opacity: { duration: 0.3, ease: "easeOut" },
};

// 1b. انزلاق اللوحة الجانبية كسحاب من اليمين (Right Side Drawer Slide)
export const drawerSlideRightVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

export const drawerSlideRightTransition: Transition = {
  duration: 0.42,
  ease: UNIFIED_EASING,
};

// 2. انزلاق وظهور الأقسام والعناوين عند التمرير (Section Scroll Fade-Up)
export const sectionFadeUpVariants = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, ease: UNIFIED_EASING },
};

// 3. الدخول المتتابع الواضح للنصوص والعناصر (Staggered Text Item Entrance)
export const itemFadeInRight = (delay = 0.05) => ({
  initial: { opacity: 0, x: 22 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.35, ease: UNIFIED_EASING },
});

// 4. انزلاق وتلاشي الهيدر العلوي (Navbar Fade Down)
export const navbarFadeDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: UNIFIED_EASING },
};

// 5. التحويم والتفاعل البصري الحركي الممتاز (Subtle Micro Hover)
export const subtleMicroHover = {
  whileHover: { scale: 1.03, filter: "brightness(1.08)" },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};
