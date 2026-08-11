import apiClient from './api/api.client';
import { API_ROUTES } from './api/api.routes';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: string;
}

/**
 * الرمز لا يصل إلى الواجهة إطلاقاً — يُضبط ككوكي httpOnly من الخادم،
 * فلا يستطيع أي سكربت في الصفحة قراءته أو سرقته.
 */
export interface AuthResponse {
  user: AuthUser;
}

export class AuthService {
  static async login(credentials: any): Promise<AuthResponse> {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    // The backend returns an ApiResponse wrapper, the actual payload is in .data
    return response.data.data;
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    } catch (e) {
      console.error('Logout error', e);
    }
  }

  static async changePassword(data): Promise<any> {
    const response = await apiClient.put(API_ROUTES.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  }

}
