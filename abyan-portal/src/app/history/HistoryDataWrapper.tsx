import React from "react";
import { HistoryService } from "@/services/history.service";
import HistoryClient from "@/components/features/history/HistoryClient";

// Layer 2: async Server Component — fetches data and passes to Client
export default async function HistoryDataWrapper() {
  // Deliberate delay to allow skeleton inspection during development


  const historyEras = await HistoryService.getEras();

  return <HistoryClient historyEras={historyEras} />;
}
