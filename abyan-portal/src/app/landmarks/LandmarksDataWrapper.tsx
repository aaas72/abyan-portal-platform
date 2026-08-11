import React from "react";
import { LandmarksService } from "@/services/landmarks.service";
import LandmarksClient from "@/components/features/landmarks/LandmarksClient";

export default async function LandmarksDataWrapper() {
  // Deliberate artificial delay for inspecting Purple Geometric Skeleton


  // Layer 2: Fetch data from backend service
  const landmarkCategories = await LandmarksService.getCategories();

  return <LandmarksClient initialData={landmarkCategories} />;
}
