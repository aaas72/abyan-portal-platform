import React from "react";
import { CopyrightService } from "@/services/copyright.service";
import CopyrightClient from "@/components/features/copyright/CopyrightClient";

// Layer 2: async Server Component — fetches data and passes to Client
export default async function CopyrightDataWrapper() {
  const content = await CopyrightService.getCopyrightContent();
  const safeContent = Array.isArray(content) ? null : content;

  const declarations = (safeContent?.declarations || []).slice(0, 15);
  const pillars = (safeContent?.pillars || []).slice(0, 15);
  const guidelines = (safeContent?.guidelines || []).slice(0, 15);
  const contactNotice = (safeContent?.contactNotice || []).slice(0, 15);

  return (
    <CopyrightClient
      declarations={declarations}
      pillars={pillars}
      guidelines={guidelines}
      contactNotice={contactNotice}
    />
  );
}
