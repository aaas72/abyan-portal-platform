import React from "react";
import { TermsService } from "@/services/terms.service";
import TermsClient from "@/components/features/terms/TermsClient";

// Layer 2: async Server Component — fetches data and passes to Client
export default async function TermsDataWrapper() {
  const content = await TermsService.getTermsContent();
  const safeContent = Array.isArray(content) ? null : content;

  const intro = (safeContent?.intro || []).slice(0, 15);
  const usageRules = (safeContent?.usageRules || []).slice(0, 15);
  const intellectualProperty = (safeContent?.intellectualProperty || []).slice(0, 15);
  const disclaimer = (safeContent?.disclaimer || []).slice(0, 15);

  return (
    <TermsClient
      intro={intro}
      usageRules={usageRules}
      intellectualProperty={intellectualProperty}
      disclaimer={disclaimer}
    />
  );
}
