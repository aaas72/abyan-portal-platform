import React from "react";
import { AboutService } from "@/services/about.service";
import AboutClient from "@/components/features/about/AboutClient";

// Layer 2: async Server Component — fetches data and passes to Client
export default async function AboutDataWrapper() {
  const content = await AboutService.getAboutContent();
  const safeContent = Array.isArray(content) ? null : content;

  const pillars = (safeContent?.pillars || []).slice(0, 15);
  const values = (safeContent?.values || []).slice(0, 15);
  const scopes = (safeContent?.scopes || []).slice(0, 15);
  const stats = (safeContent?.stats || []).slice(0, 15);

  return (
    <AboutClient
      pillars={pillars}
      values={values}
      scopes={scopes}
      stats={stats}
    />
  );
}
