import React from "react";
import { PrivacyService } from "@/services/privacy.service";
import PrivacyClient from "@/components/features/privacy/PrivacyClient";

// Layer 2: async Server Component — fetches data and passes to Client
export default async function PrivacyDataWrapper() {
  const content = await PrivacyService.getPrivacyContent();
  const safeContent = Array.isArray(content) ? null : content;

  const intro = (safeContent?.intro || []).slice(0, 15);
  const dataCollection = (safeContent?.dataCollection || []).slice(0, 15);
  const usageAndProtection = (safeContent?.usageAndProtection || []).slice(0, 15);
  const cookiesAndAnalytics = (safeContent?.cookiesAndAnalytics || []).slice(0, 15);

  return (
    <PrivacyClient
      intro={intro}
      dataCollection={dataCollection}
      usageAndProtection={usageAndProtection}
      cookiesAndAnalytics={cookiesAndAnalytics}
    />
  );
}
