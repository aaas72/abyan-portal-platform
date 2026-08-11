import apiClient, { ApiResponse } from './api.client';

export const extractData = <T>(response: { data: ApiResponse<T> }): T => {
  const { data: resData } = response;
  if (!resData.success) {
    throw new Error(resData.message || 'API Request failed');
  }
  return resData.data as T;
};

export async function fetchData<T>(endpoint: string, schema?: any): Promise<T> {
  try {
    const response = await apiClient.get(endpoint);
    if (response.data && response.data.success) {
      if (schema) {
        return schema.parse(response.data.data) as T;
      }
      return response.data.data as T;
    }
    return [] as unknown as T;
  } catch (error: any) {
    console.warn(`[API Fallback] Fetch failed for ${endpoint}: ${error?.message || 'Unknown error'}`);
    return [] as unknown as T;
  }
}
