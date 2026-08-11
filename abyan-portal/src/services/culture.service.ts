import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { extractData, fetchData } from './api/api.helpers';

import { CultureCategorySchema, CultureCategory } from '@/types/schemas';

import { AdminCultureCategory, AdminCultureItem } from '@/types/admin.types';

export class CultureService {
  static async getCategories(district?: string): Promise<CultureCategory[]> {
    const url = district ? `${API_ROUTES.CULTURE.FRONTEND}?district=${encodeURIComponent(district)}` : API_ROUTES.CULTURE.FRONTEND;
    return fetchData<CultureCategory[]>(url, CultureCategorySchema.array());
  }
  static getFolkAudioTracks() { return []; }

  static async getCategoriesAdmin(): Promise<{ data: AdminCultureCategory[] }> {
    try {
      const response = await apiClient.get(API_ROUTES.CULTURE.CATEGORIES);
      return { data: extractData<AdminCultureCategory[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createCategory(data: any) {
    const response = await apiClient.post(API_ROUTES.CULTURE.CATEGORIES, data);
    return { data: extractData(response) };
  }

  static async updateCategory(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.CULTURE.CATEGORIES}/${id}`, data);
    return { data: extractData(response) };
  }

  static async deleteCategory(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.CULTURE.CATEGORIES}/${id}`);
    return { data: extractData(response) };
  }

  // --- Food Cards ---

  static async getItems(): Promise<{ data: AdminCultureItem[] }> {
    try {
      const response = await apiClient.get(API_ROUTES.CULTURE.FOOD_CARDS);
      return { data: extractData<AdminCultureItem[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createItem(data: any) {
    const response = await apiClient.post(API_ROUTES.CULTURE.FOOD_CARDS, data);
    return { data: extractData(response) };
  }

  static async updateItem(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.CULTURE.FOOD_CARDS}/${id}`, data);
    return { data: extractData(response) };
  }

  static async deleteItem(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.CULTURE.FOOD_CARDS}/${id}`);
    return { data: extractData(response) };
  }
}
