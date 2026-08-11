import apiClient from './api/api.client';
import { ContactInfo } from '@/types/schemas';

export const ContactService = {
  getContactInfo: async (): Promise<ContactInfo | null> => {
    try {
      // Fetch contact info from backend
      const response = await apiClient.get<{ success: boolean; data: ContactInfo }>('/contact/frontend');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching contact info:", error);
      return null;
    }
  },

  updateContactInfo: async (data: ContactInfo): Promise<ContactInfo | null> => {
    try {
      const response = await apiClient.put<{ success: boolean; data: ContactInfo }>('/contact', data);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error updating contact info:", error);
      throw error;
    }
  }
};
