import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { extractData, fetchData } from './api/api.helpers';
import { PioneerCategorySchema, PioneerCategory } from '@/types/schemas';

import { AdminPioneer, AdminPioneerCategory } from '@/types/admin.types';

export class PioneersService {
  // --- Portal (Frontend) ---
  static async getCategories(district?: string): Promise<PioneerCategory[]> {
    const url = district ? `${API_ROUTES.PIONEERS.FRONTEND}?district=${encodeURIComponent(district)}` : API_ROUTES.PIONEERS.FRONTEND;
    return fetchData<PioneerCategory[]>(url, PioneerCategorySchema.array());
  }

  // --- Admin (Dashboard) ---
  static async getAdminFigures(page: number = 1, limit: number = 10): Promise<{ data: AdminPioneer[]; total: number; hasMore: boolean }> {
    try {
      const response = await apiClient.get(API_ROUTES.PIONEERS.FIGURES);
      const data = extractData<any[]>(response).map(p => ({ ...p, isActive: p.isPublished }));
      return { data, total: data.length, hasMore: false };
    } catch (error) {
      console.error('Error fetching admin pioneers:', error);
      return { data: [], total: 0, hasMore: false };
    }
  }

  static async getAdminCategories(): Promise<{ data: AdminPioneerCategory[]; total: number }> {
    try {
      const response = await apiClient.get(API_ROUTES.PIONEERS.CATEGORIES);
      const data = extractData<any[]>(response).map(p => ({ ...p, isActive: p.isPublished }));
      return { data, total: data.length };
    } catch (error) {
      console.error('Error fetching admin pioneer categories:', error);
      return { data: [], total: 0 };
    }
  }
  static async createCategory(data: any) {
    const response = await apiClient.post(API_ROUTES.PIONEERS.CATEGORIES, data);
    return { data: extractData(response) };
  }
  static async updateCategory(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.PIONEERS.CATEGORIES}/${id}`, data);
    return { data: extractData(response) };
  }
  static async deleteCategory(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.PIONEERS.CATEGORIES}/${id}`);
    return extractData(response);
  }

  static async createFigure(data: any) {
    const response = await apiClient.post(API_ROUTES.PIONEERS.FIGURES, data);
    return { data: extractData(response) };
  }
  static async updateFigure(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.PIONEERS.FIGURES}/${id}`, data);
    return { data: extractData(response) };
  }
  static async deleteFigure(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.PIONEERS.FIGURES}/${id}`);
    return extractData(response);
  }
}
