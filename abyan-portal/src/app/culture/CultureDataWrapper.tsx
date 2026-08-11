import React from "react";
import { CultureService } from "@/services/culture.service";
import CultureClient from "@/components/features/culture/CultureClient";

export default async function CultureDataWrapper() {
  // Deliberate artificial delay for inspecting Purple Geometric Skeleton


  const initialCategories = await CultureService.getCategories();
  
  const folkAudioTracks = initialCategories
    .map(c => c.audioTrack)
    .filter((track): track is NonNullable<typeof track> => !!track);

  return (
    <CultureClient
      initialCategories={initialCategories}
      folkAudioTracks={folkAudioTracks}
    />
  );
}
