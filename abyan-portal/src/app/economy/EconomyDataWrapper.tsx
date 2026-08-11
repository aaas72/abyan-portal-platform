import React from "react";
import { EconomyService } from "@/services/economy.service";
import EconomyClient from "@/components/features/economy/EconomyClient";

export default async function EconomyDataWrapper() {
  // Deliberate artificial delay for inspecting Purple Geometric Skeleton


  const initialPillars = await EconomyService.getPillars();

  return <EconomyClient initialPillars={initialPillars} />;
}
