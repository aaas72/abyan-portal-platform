import { fetchData } from './api/api.helpers';
import { API_ROUTES } from './api/api.routes';
import { TermsContentSchema, TermsContent } from '@/types/schemas';

export class TermsService {
  static async getTermsContent(): Promise<TermsContent | null> {
    try {
      return await fetchData<TermsContent>(API_ROUTES.TERMS.FRONTEND, TermsContentSchema);
    } catch (error) {
      console.error('Failed to fetch Terms Content', error);
      return null;
    }
  }

  static async getAdminTermsContent(): Promise<TermsContent | null> {
    try {
      return await fetchData<TermsContent>(API_ROUTES.TERMS.BASE, TermsContentSchema);
    } catch (error) {
      console.error('Failed to fetch Admin Terms Content', error);
      return null;
    }
  }

  static async updateTermsContent(data: Partial<TermsContent>): Promise<{ success: boolean; data?: TermsContent }> {
    try {
      const { default: apiClient } = await import('./api/api.client');
      const response = await apiClient.put<TermsContent>(API_ROUTES.TERMS.BASE, data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update Terms Content', error);
      throw error;
    }
  }
}
