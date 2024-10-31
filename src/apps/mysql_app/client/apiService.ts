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

  // Create a new user
  public async createUser(name: string, email: string, age: number): Promise<void> {
    try {
      await this.client.post('/users', { name, email, age });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error creating user');
    }
  }

  // Get a user by ID
  public async getUserById(id: number): Promise<any> {
    try {
      const response = await this.client.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching user');
    }
  }

  // Get all users
  public async getAllUsers(): Promise<any[]> {
    try {
      const response = await this.client.get('/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching users');
    }
  }

  // Update a user
  public async updateUser(id: number, name: string, email: string, age: number): Promise<void> {
    try {
      await this.client.put(`/users/${id}`, { name, email, age });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error updating user');
    }
  }

  // Delete a user
  public async deleteUser(id: number): Promise<void> {
    try {
      await this.client.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error deleting user');
    }
  }
}

export default APIService;
