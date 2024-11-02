import axios, { AxiosInstance } from 'axios';

class APIService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Create or Update a key
  public async setKey(key: string, value: string): Promise<void> {
    try {
      await this.client.post('/set', { key, value });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error setting key');
    }
  }

  // Get a key's value
  public async getKey(key: string): Promise<string> {
    try {
      const response = await this.client.get(`/get/${key}`);
      return response.data.value;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error getting key');
    }
  }

  // Delete a key
  public async deleteKey(key: string): Promise<void> {
    try {
      await this.client.delete(`/delete/${key}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error deleting key');
    }
  }

  // Get all keys
  public async getAllKeys(): Promise<string[]> {
    try {
      const response = await this.client.get('/keys');
      return response.data.keys;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching keys');
    }
  }
}

export default APIService;
