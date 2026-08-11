import apiClient from './api/api.client';
import { extractData } from './api/api.helpers';

export class UploadService {
  static async uploadFile(file: File, folder?: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return extractData(response);
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }
}
