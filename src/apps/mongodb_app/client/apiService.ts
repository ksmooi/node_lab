import axios, { AxiosInstance } from 'axios';

class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Create a new post
  public async createPost(data: { title: string; content: string; author: string }) {
    try {
        const response = await this.client.post('/api/posts', data);
        return response.data;
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 2xx
        throw new Error(`${error.response.data.message}: ${error.response.data.error}`);
      } else if (error.request) {
        // No response received
        throw new Error('No response from server. Please check if the server is running.');
      } else {
        // Other errors
        throw new Error(`Error creating post: ${error.message}`);
      }
    }
  }

  // Get all posts
  public async getAllPosts() {
    try {
      const response = await this.client.get('/api/posts');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching posts');
    }
  }

  // Get a post by ID
  public async getPostById(id: string) {
    try {
      const response = await this.client.get(`/api/posts/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching post');
    }
  }

  // Update a post by ID
  public async updatePost(id: string, data: { title?: string; content?: string; author?: string }) {
    try {
      const response = await this.client.put(`/api/posts/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error updating post');
    }
  }

  // Delete a post by ID
  public async deletePost(id: string) {
    try {
      const response = await this.client.delete(`/api/posts/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error deleting post');
    }
  }
}

export default ApiService;
