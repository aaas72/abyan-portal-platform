import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { extractData, fetchData } from './api/api.helpers';
import { EconomyPillarSchema, EconomyPillar } from '@/types/schemas';

import { AdminEconomyPillar, AdminEconomyPhotoCard } from '@/types/admin.types';

export class EconomyService {
  static async getPillars(district?: string): Promise<EconomyPillar[]> {
    const url = district ? `${API_ROUTES.ECONOMY.FRONTEND}?district=${encodeURIComponent(district)}` : API_ROUTES.ECONOMY.FRONTEND;
    return fetchData<EconomyPillar[]>(url, EconomyPillarSchema.array());
  }


  static async getPillarsAdmin(): Promise<{ data: AdminEconomyPillar[] }> {
    try {
      const response = await apiClient.get(API_ROUTES.ECONOMY.PILLARS);
      return { data: extractData<AdminEconomyPillar[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createPillar(data: any) {
    const response = await apiClient.post(API_ROUTES.ECONOMY.PILLARS, data);
    return { data: extractData(response) };
  }

  static async updatePillar(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.ECONOMY.PILLARS}/${id}`, data);
    return { data: extractData(response) };
  }

  static async deletePillar(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.ECONOMY.PILLARS}/${id}`);
    return { data: extractData(response) };
  }

  // --- Photo Cards ---

  static async getPhotoCards(): Promise<{ data: AdminEconomyPhotoCard[] }> {
    try {
      const response = await apiClient.get(API_ROUTES.ECONOMY.PHOTO_CARDS);
      return { data: extractData<AdminEconomyPhotoCard[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createPhotoCard(data: any) {
    const response = await apiClient.post(API_ROUTES.ECONOMY.PHOTO_CARDS, data);
    return { data: extractData(response) };
  }

  static async updatePhotoCard(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.ECONOMY.PHOTO_CARDS}/${id}`, data);
    return { data: extractData(response) };
  }

  static async deletePhotoCard(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.ECONOMY.PHOTO_CARDS}/${id}`);
    return { data: extractData(response) };
  }
}
