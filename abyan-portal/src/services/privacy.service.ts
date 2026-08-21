import { fetchData } from './api/api.helpers';
import { API_ROUTES } from './api/api.routes';
import { PrivacyContentSchema, PrivacyContent } from '@/types/schemas';

export class PrivacyService {
  static async getPrivacyContent(): Promise<PrivacyContent | null> {
    try {
      return await fetchData<PrivacyContent>(API_ROUTES.PRIVACY.FRONTEND, PrivacyContentSchema);
    } catch (error) {
      console.error('Failed to fetch Privacy Content', error);
      return null;
    }
  }

  static async getAdminPrivacyContent(): Promise<PrivacyContent | null> {
    try {
      return await fetchData<PrivacyContent>(API_ROUTES.PRIVACY.BASE, PrivacyContentSchema);
    } catch (error) {
      console.error('Failed to fetch Admin Privacy Content', error);
      return null;
    }
  }

  static async updatePrivacyContent(data: Partial<PrivacyContent>): Promise<{ success: boolean; data?: PrivacyContent }> {
    try {
      const { default: apiClient } = await import('./api/api.client');
      const response = await apiClient.put<PrivacyContent>(API_ROUTES.PRIVACY.BASE, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update Privacy Content', error);
      throw error;
    }
  }
}
