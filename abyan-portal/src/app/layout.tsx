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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abyanportal.org";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "بوابة أبين الثقافية | مهد الحضارة والتراث والدلتا الخضراء",
    template: "%s | بوابة أبين الثقافية",
  },
  description:
    "الموسوعة الثقافية والتوثيقية الرسمية لمحافظة أبين: استكشف تاريخ المديريات والقرى، المعالم والحصون الأثرية، الأعلام والرواد، والموروث الشعبي والزراعي.",
  keywords: [
    "أبين",
    "محافظة أبين",
    "بوابة أبين",
    "بوابة أبين الثقافية",
    "تاريخ أبين",
    "مديريات أبين",
    "زنجبار",
    "خنفر",
    "جعار",
    "الكود",
    "شقرة",
    "لودر",
    "دمان",
    "العين",
    "مودية",
    "المحفد",
    "أحور",
    "الوضيع",
    "جيشان",
    "رصد",
    "سرار",
    "سباح",
    "يافع بني قاصد",
    "حصن القارة",
    "سد باتيس",
    "دلتا بنا",
    "وادي حسان",
    "وادي أحور",
    "جبل ثرة",
    "معالم أبين",
    "أعلام أبين",
    "تراث أبين",
    "اليمن",
  ],
  authors: [{ name: "فريق بوابة أبين الثقافية" }],
  creator: "بوابة أبين الثقافية",
  publisher: "بوابة أبين الثقافية",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "ar-YE": "/",
      "ar": "/",
    },
  },
  openGraph: {
    title: "بوابة أبين الثقافية | مهد الحضارة والتراث والدلتا الخضراء",
    description:
      "الموسوعة الثقافية والتوثيقية الرسمية لمحافظة أبين: تاريخ المديريات، القرى، الحصون، الأعلام، والتراث الزراعي والبحري.",
    url: siteUrl,
    siteName: "بوابة أبين الثقافية",
    locale: "ar_YE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "بوابة أبين الثقافية | مهد الحضارة والتراث والدلتا الخضراء",
    description:
      "الموسوعة الثقافية والتوثيقية الرسمية لمحافظة أبين جنوبي اليمن.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

import AnalyticsTracker from "@/components/AnalyticsTracker";

// يُشتق أصل الواجهة الخلفية من نفس المتغير المستخدم في عميل axios
// حتى لا ينحرف الـ CSP عن المنفذ الفعلي عند تغييره.
const apiOrigin = new URL(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
).origin;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`scroll-smooth ${abyanTitleFont.variable} ${abyanBodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' ${apiOrigin} https:;`}
        />
      </head>
      <body
        className="antialiased selection:bg-sky-500 selection:text-white bg-white text-slate-900 min-h-screen flex flex-col font-cairo"
        suppressHydrationWarning
      >
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
