import apiClient from './api/api.client';

export interface User {
  _id: string;
  name: string;
  username: string;
  role: 'admin' | 'writer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class UsersService {
  private readonly basePath = '/users';

  async getUsers(): Promise<{ success: boolean; data: User[] }> {
    const response = await apiClient.get(this.basePath);
    return response.data;
  }

  async getUserById(id: string): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async createUser(data: Partial<User> & { password?: string }): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.post(this.basePath, data);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User> & { password?: string }): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`${this.basePath}/${id}`);
    return response.data;
  }
}

export const usersService = new UsersService();
