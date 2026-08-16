export interface AdminAboutPillar {
  _id: string;
  title: string;
  description: string;
}

export interface AdminAboutValue {
  _id: string;
  title: string;
  description: string;
}

export interface AdminAboutScope {
  _id: string;
  title: string;
  summary: string;
  items: string[];
}

export interface AdminAboutStat {
  _id: string;
  number: string;
  label: string;
}

export interface AdminAboutContent {
  _id?: string;
  pillars: AdminAboutPillar[];
  values: AdminAboutValue[];
  scopes: AdminAboutScope[];
  stats: AdminAboutStat[];
}

export interface AdminDistrict {
  _id: string;
  name: string;
  title: string;
  region: string;
  regionLabel: string;
  capital: string;
  areaKm2: string;
  areaPercentage: string;
  authorName?: string;
  crops: string[];
  landmarks: string[];
  villages: string[];
  description: string;
  geography: string;
  images?: string[];
  isActive: boolean;
}

export interface AdminDistrictRegion {
  _id: string;
  regionKey: string;
  regionLabel: string;
  description?: string;
  isActive: boolean;
}

export interface AdminPioneer {
  _id: string;
  name: string;
  title: string;
  startYear: string;
  endYear: string;
  origin?: string;
  authorName?: string;
  isActive: boolean;
  category?: string;
  biography?: string;
  quote?: string;
  birthDate?: string;
  achievements?: string[];
  images?: string[];
}

export interface AdminPioneerCategory {
  _id: string;
  categoryName: string;
  title: string;
  subtitle: string;
  description?: string;
  keyFigures?: string[];
  details?: string[];
  isActive: boolean;
}

export interface AdminHistoryEra {
  _id: string;
  startYear: string;
  endYear: string;
  eraTitle: string;
  historicalCapital: string;
  authorName?: string;
  shortSummary: string;
  fullDescription: string;
  keyEvents: string[];
  notableLandmarks: string[];
  isActive: boolean;
}

export interface AdminLandmarkCategory {
  _id: string;
  categoryName: string;
  title: string;
  subtitle: string;
  description: string;
  keyLandmarks: string[];
  details: string[];
  isActive: boolean;
}

export interface AdminLandmarkPhotoCard {
  _id: string;
  category: string; // Will hold the category _id
  title: string;
  tag: string;
  location: string;
  authorName?: string;
  description: string;
  bgGradient?: string;
  images?: string[];
  startYear?: string;
  endYear?: string;
  isActive: boolean;
}

export interface AdminCultureCategory {
  _id: string;
  categoryName: string;
  title: string;
  subtitle: string;
  description: string;
  primaryTags: string[];
  details: string[];
  audioTrack?: {
    title: string;
    artist: string;
    category: string;
    duration: string;
    lyricsExcerpt: string;
  };
  visualShowcase?: {
    title: string;
    tag: string;
    description: string;
    bgGradient: string;
  };
  isActive: boolean;
}

export interface AdminCultureItem {
  _id: string;
  category: string;
  title: string;
  tag: string;
  location: string;
  authorName?: string;
  description: string;
  bgGradient: string;
  images?: string[];
  isActive: boolean;
}

export interface AdminEconomyPillar {
  _id: string;
  pillarName: string;
  title: string;
  subtitle: string;
  description: string;
  keyProducts: string[];
  details: string[];
  images?: string[];
  isActive: boolean;
}

export interface AdminEconomyPhotoCard {
  _id: string;
  pillar: string;
  title: string;
  tag: string;
  location: string;
  authorName?: string;
  description: string;
  bgGradient: string;
  images?: string[];
  isActive: boolean;
}

export interface AdminGalleryImage {
  _id: string;
  title: string;
  category: string;
  categoryLabel?: string;
  date: string;
  year?: string;
  location?: string;
  authorName?: string;
  description?: string;
  images?: string[];
  isActive: boolean;
}

export interface AdminArchiveCategory {
  _id: string;
  categoryName: string;
  title: string;
  subtitle: string;
  description?: string;
  keyTags?: string[];
  details?: string[];
  isActive: boolean;
}

export interface AdminLandingSection {
  _id: string;
  sectionId: string;
  name: string;
  title?: string;
  subtitle?: string;
  images?: string[];
  isActive: boolean;
}

export interface AdminHighlightItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  linkText: string;
  href: string;
  isActive: boolean;
}
