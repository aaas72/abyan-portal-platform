import "./globals.css";
import React from "react";
import localFont from "next/font/local";

const abyanTitleFont = localFont({
  src: "../../public/fonts/thmanyah-serif-display-black.otf",
  variable: "--font-abyan-title",
  display: "swap",
});

const abyanBodyFont = localFont({
  src: "../../public/fonts/thmanyah-serif-display-regular.otf",
  variable: "--font-abyan-body",
  display: "swap",
});

export const metadata = {
  title: "أبين - مهد الحضارة والتراث والدلتا الخضراء",
  description: "بوابة إلكترونية وثقافية شاملة تستعرض تاريخ، تراث، جغرافيا، ومعالم محافظة أبين جنوبي اليمن.",
  keywords: ["أبين", "محافظة أبين", "زنجبار", "جعار", "خنفر", "حصن القارة", "سد باتيس", "تراث أبين", "اليمن"],
};

import AnalyticsTracker from "@/components/AnalyticsTracker";

// يُشتق أصل الواجهة الخلفية من نفس المتغير المستخدم في عميل axios
// حتى لا ينحرف الـ CSP عن المنفذ الفعلي عند تغييره.
const apiOrigin = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
).origin;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`scroll-smooth ${abyanTitleFont.variable} ${abyanBodyFont.variable}`} suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={`default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' ${apiOrigin} https:;`} />
      </head>
      <body className="antialiased selection:bg-sky-500 selection:text-white bg-white text-slate-900 min-h-screen flex flex-col font-cairo" suppressHydrationWarning>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
