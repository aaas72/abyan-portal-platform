import { fetchData } from './api/api.helpers';
import { API_ROUTES } from './api/api.routes';
import { CopyrightContentSchema, CopyrightContent } from '@/types/schemas';

export class CopyrightService {
  static async getCopyrightContent(): Promise<CopyrightContent | null> {
    try {
      return await fetchData<CopyrightContent>(API_ROUTES.COPYRIGHT.FRONTEND, CopyrightContentSchema);
    } catch (error) {
      console.error('Failed to fetch Copyright Content', error);
      return null;
    }
  }

  static async getAdminCopyrightContent(): Promise<CopyrightContent | null> {
    try {
      return await fetchData<CopyrightContent>(API_ROUTES.COPYRIGHT.BASE, CopyrightContentSchema);
    } catch (error) {
      console.error('Failed to fetch Admin Copyright Content', error);
      return null;
    }
  }

  static async updateCopyrightContent(data: Partial<CopyrightContent>): Promise<{ success: boolean; data?: CopyrightContent }> {
    try {
      const { default: apiClient } = await import('./api/api.client');
      const response = await apiClient.put<CopyrightContent>(API_ROUTES.COPYRIGHT.BASE, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update Copyright Content', error);
      throw error;
    }
  }
}
