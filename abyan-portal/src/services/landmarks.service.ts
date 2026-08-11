import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { extractData, fetchData } from './api/api.helpers';
import { LandmarkCategorySchema, LandmarkCategory } from '@/types/schemas';
import { AdminLandmarkCategory, AdminLandmarkPhotoCard } from '@/types/admin.types';

export class LandmarksService {
  static async getCategories(district?: string): Promise<LandmarkCategory[]> {
    const url = district ? `${API_ROUTES.LANDMARKS.FRONTEND}?district=${encodeURIComponent(district)}` : API_ROUTES.LANDMARKS.FRONTEND;
    return fetchData<LandmarkCategory[]>(url, LandmarkCategorySchema.array());
  }

  // --- Admin Categories ---
  static async getAdminCategories(): Promise<{ data: AdminLandmarkCategory[] }> {
    try {
      const response = await apiClient.get(`${API_ROUTES.LANDMARKS.BASE}/categories`);
      return { data: extractData<AdminLandmarkCategory[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createCategory(data: any) {
    const response = await apiClient.post(`${API_ROUTES.LANDMARKS.BASE}/categories`, data);
    return { data: extractData(response) };
  }

  static async updateCategory(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.LANDMARKS.BASE}/categories/${id}`, data);
    return { data: extractData(response) };
  }

  static async deleteCategory(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.LANDMARKS.BASE}/categories/${id}`);
    return { data: extractData(response) };
  }

  // --- Admin Photo Cards ---
  static async getAdminPhotoCards(): Promise<{ data: AdminLandmarkPhotoCard[] }> {
    try {
      const response = await apiClient.get(`${API_ROUTES.LANDMARKS.BASE}/photo-cards`);
      return { data: extractData<AdminLandmarkPhotoCard[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createPhotoCard(data: any) {
    const response = await apiClient.post(`${API_ROUTES.LANDMARKS.BASE}/photo-cards`, data);
    return { data: extractData(response) };
  }

  static async updatePhotoCard(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.LANDMARKS.BASE}/photo-cards/${id}`, data);
    return { data: extractData(response) };
  }

  static async deletePhotoCard(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.LANDMARKS.BASE}/photo-cards/${id}`);
    return { data: extractData(response) };
  }
}
