import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { extractData, fetchData } from './api/api.helpers';

import { ArchiveItemSchema, ArchiveItem } from '@/types/schemas';
import { AdminGalleryImage, AdminArchiveCategory } from '@/types/admin.types';

export class GalleryService {
  static async getArchive(): Promise<ArchiveItem[]> {
    return fetchData<ArchiveItem[]>(API_ROUTES.GALLERY.FRONTEND, ArchiveItemSchema.array());
  }
  static async getCategories(): Promise<{ data: AdminArchiveCategory[] }> { 
    try {
      const response = await apiClient.get(`${API_ROUTES.GALLERY.BASE}/categories`);
      return { data: extractData<AdminArchiveCategory[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }
  static async createCategory(data: any) {
    const response = await apiClient.post(`${API_ROUTES.GALLERY.BASE}/categories`, data);
    return { data: extractData(response) };
  }
  static async updateCategory(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.GALLERY.BASE}/categories/${id}`, data);
    return { data: extractData(response) };
  }
  static async deleteCategory(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.GALLERY.BASE}/categories/${id}`);
    return { data: extractData(response) };
  }

  static async getAdminImages(): Promise<{ data: AdminGalleryImage[] }> {
    try {
      const response = await apiClient.get(API_ROUTES.GALLERY.BASE);
      return { data: extractData<AdminGalleryImage[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }
  static async createImage(data: any) {
    const response = await apiClient.post(API_ROUTES.GALLERY.BASE, data);
    return { data: extractData(response) };
  }
  static async updateImage(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.GALLERY.BASE}/${id}`, data);
    return { data: extractData(response) };
  }
  static async deleteImage(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.GALLERY.BASE}/${id}`);
    return { data: extractData(response) };
  }
}
