import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';
import { extractData } from './api/api.helpers';
import { AdminHighlightItem, AdminLandingSection } from '@/types/admin.types';

export class HighlightsService {
  // --- Landing Highlights ---
  static async getHighlights(): Promise<{ data: AdminHighlightItem[] }> {
    try {
      const response = await apiClient.get(API_ROUTES.HIGHLIGHTS.BASE);
      return { data: extractData<AdminHighlightItem[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createHighlight(data: any) {
    const response = await apiClient.post(API_ROUTES.HIGHLIGHTS.BASE, data);
    return { data: extractData(response) };
  }

  static async updateHighlight(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.HIGHLIGHTS.BASE}/${id}`, data);
    return { data: extractData(response) };
  }

  static async deleteHighlight(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.HIGHLIGHTS.BASE}/${id}`);
    return { data: extractData(response) };
  }

  // --- Landing Sections ---
  static async getLandingSections(): Promise<{ data: AdminLandingSection[] }> {
    try {
      const response = await apiClient.get(`${API_ROUTES.HIGHLIGHTS.SECTIONS}/all`);
      return { data: extractData<AdminLandingSection[]>(response) };
    } catch (error) {
      return { data: [] };
    }
  }

  static async createLandingSection(data: any) {
    const response = await apiClient.post(API_ROUTES.HIGHLIGHTS.SECTIONS, data);
    return { data: extractData(response) };
  }

  static async updateLandingSection(id: string, data: any) {
    const response = await apiClient.put(`${API_ROUTES.HIGHLIGHTS.SECTIONS}/${id}`, data);
    return { data: extractData(response) };
  }

  static async deleteLandingSection(id: string) {
    const response = await apiClient.delete(`${API_ROUTES.HIGHLIGHTS.SECTIONS}/${id}`);
    return { data: extractData(response) };
  }
}
