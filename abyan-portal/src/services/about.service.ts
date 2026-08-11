import { fetchData } from './api/api.helpers';
import { API_ROUTES } from './api/api.routes';

import { AboutContentSchema, AboutContent, AboutPillarItemSchema, AboutPillarItem, HighlightItemSchema, HighlightItem } from '@/types/schemas';

import { AdminLandingSection } from '@/types/admin.types';

export class AboutService {
  static async getHighlights(): Promise<HighlightItem[]> {
    return fetchData<HighlightItem[]>(API_ROUTES.HIGHLIGHTS.FRONTEND, HighlightItemSchema.array());
  }
  static async getLandingSections(): Promise<AdminLandingSection[]> {
    return fetchData<AdminLandingSection[]>(`${API_ROUTES.HIGHLIGHTS.SECTIONS}/frontend`);
  }
  static async getAboutContent(): Promise<AboutContent | null> {
    try {
      return await fetchData<AboutContent>(API_ROUTES.ABOUT.FRONTEND, AboutContentSchema);
    } catch (error) {
      console.error('Failed to fetch About Content', error);
      return null;
    }
  }

  static async getAdminAboutContent(): Promise<AboutContent | null> {
    try {
      return await fetchData<AboutContent>(API_ROUTES.ABOUT.BASE, AboutContentSchema);
    } catch (error) {
      console.error('Failed to fetch Admin About Content', error);
      return null;
    }
  }

  static async updateAboutContent(data: Partial<AboutContent>): Promise<{ success: boolean; data?: AboutContent }> {
    try {
      const { default: apiClient } = await import('./api/api.client');
      const response = await apiClient.put<AboutContent>(API_ROUTES.ABOUT.BASE, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update About Content', error);
      throw error;
    }
  }
}
