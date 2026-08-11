import React from "react";
import { GalleryService } from "@/services/gallery.service";
import GalleryClient from "@/components/features/gallery/GalleryClient";

export default async function GalleryDataWrapper() {
  // Deliberate artificial delay for inspecting Purple Geometric Skeleton


  const catRes = await GalleryService.getCategories();
  const initialCategories = (catRes.data || [])
    .filter(cat => cat.isActive !== false)
    .map(cat => ({ id: cat.categoryName, label: cat.title }));

  const galleryItems = await GalleryService.getArchive(); // async
  return (
    <GalleryClient
      initialCategories={initialCategories}
      galleryItems={galleryItems}
    />
  );
}
