import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { extractData, fetchData } from './api/api.helpers';

import { DistrictItemSchema, DistrictItem } from '@/types/schemas';

import { AdminDistrict, AdminDistrictRegion } from '@/types/admin.types';

export class DistrictsService {
  static async getAllDistricts(): Promise<DistrictItem[]> {
    return fetchData<DistrictItem[]>(API_ROUTES.DISTRICTS.FRONTEND, DistrictItemSchema.array());
  }
  static async getFrontendRegions(): Promise<{ id: string; label: string; description?: string }[]> {
    try {
      const response = await apiClient.get(API_ROUTES.DISTRICTS.FRONTEND_REGIONS);
      return extractData<{ id: string; label: string; description?: string }[]>(response);
    } catch (error) {
      return [];
    }
  }

  static async getAdminDistricts(): Promise<{ data: AdminDistrict[] }> {
    try {
      const response = await apiClient.get(API_ROUTES.DISTRICTS.BASE);
      return { data: extractData<AdminDistrict[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }
  static async createDistrict(data: any) {
    const response = await apiClient.post(API_ROUTES.DISTRICTS.BASE, data);
    return { data: extractData(response) };
  }
  static async updateDistrict(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.DISTRICTS.BASE}/${id}`, data);
    return { data: extractData(response) };
  }
  static async deleteDistrict(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.DISTRICTS.BASE}/${id}`);
    return { data: extractData(response) };
  }

  // --- Admin District Regions ---
  static async getAdminRegions(): Promise<{ data: AdminDistrictRegion[] }> {
    try {
      const response = await apiClient.get(`${API_ROUTES.DISTRICTS.BASE}/regions`);
      return { data: extractData<AdminDistrictRegion[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createRegion(data: any) {
    const response = await apiClient.post(`${API_ROUTES.DISTRICTS.BASE}/regions`, data);
    return { data: extractData(response) };
  }

  static async updateRegion(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.DISTRICTS.BASE}/regions/${id}`, data);
    return { data: extractData(response) };
  }

  static async deleteRegion(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.DISTRICTS.BASE}/regions/${id}`);
    return { data: extractData(response) };
  }
}
