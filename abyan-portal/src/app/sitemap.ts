import { MetadataRoute } from "next";
import { DistrictsService } from "@/services/districts.service";
import { HistoryService } from "@/services/history.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abyanportal.org";

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/districts",
    "/history",
    "/landmarks",
    "/pioneers",
    "/culture",
    "/economy",
    "/gallery",
    "/copyright",
    "/terms",
    "/privacy",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Districts Routes
  let districtRoutes: MetadataRoute.Sitemap = [];
  try {
    const districts = await DistrictsService.getAllDistricts();
    districtRoutes = districts.map((district) => ({
      url: `${baseUrl}/districts?id=${district.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Failed to fetch districts for sitemap:", error);
  }

  // 3. Dynamic History Eras Routes
  let historyRoutes: MetadataRoute.Sitemap = [];
  try {
    const eras = await HistoryService.getEras();
    historyRoutes = eras.map((era) => ({
      url: `${baseUrl}/history?id=${era.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error("Failed to fetch history eras for sitemap:", error);
  }

  return [...staticRoutes, ...districtRoutes, ...historyRoutes];
}
