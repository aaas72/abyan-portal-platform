import React from "react";
import { PioneersService } from "@/services/pioneers.service";
import PioneersClient from "@/components/features/pioneers/PioneersClient";

export default async function PioneersDataWrapper() {
  // Deliberate artificial delay for inspecting Purple Geometric Skeleton


  const pioneerCategories = await PioneersService.getCategories();

  return <PioneersClient initialData={pioneerCategories} />;
}
