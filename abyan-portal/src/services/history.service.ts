import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { fetchData, extractData } from './api/api.helpers';
import { HistoryEraFormData } from '@/types/schemas';
import { HistoryEraSchema, HistoryEra } from '@/types/schemas';
import { AdminHistoryEra } from '@/types/admin.types';

export class HistoryService {
  static async getEras(): Promise<HistoryEra[]> {
    return fetchData<HistoryEra[]>(API_ROUTES.HISTORY.FRONTEND, HistoryEraSchema.array());
  }

  static async getTimelineEras(): Promise<HistoryEra[]> {
    return fetchData<HistoryEra[]>(`${API_ROUTES.HISTORY.FRONTEND}`, HistoryEraSchema.array());
  }

  static async getAdminEras(): Promise<{ data: AdminHistoryEra[]; total: number }> {
    try {
      const response = await apiClient.get(`${API_ROUTES.HISTORY.BASE}/eras`);
      const data = extractData<any[]>(response).map(p => ({ ...p, isActive: p.isActive ?? true }));
      return { data, total: data.length };
    } catch (error) {
      console.error('Error fetching admin eras:', error);
      return { data: [], total: 0 };
    }
  }

  static async createEra(data: HistoryEraFormData): Promise<AdminHistoryEra> {
    const response = await apiClient.post(`${API_ROUTES.HISTORY.BASE}/eras`, data);
    return extractData<AdminHistoryEra>(response);
  }

  static async updateEra(id: string, data: Partial<HistoryEraFormData>): Promise<AdminHistoryEra> {
    const response = await apiClient.put(`${API_ROUTES.HISTORY.BASE}/eras/${id}`, data);
    return extractData<AdminHistoryEra>(response);
  }

  static async deleteEra(id: string): Promise<void> {
    await apiClient.delete(`${API_ROUTES.HISTORY.BASE}/eras/${id}`);
  }
}
