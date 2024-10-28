import { Request, Response } from 'express';
import postService from './postService';
import logger from './logger';

class PostController {
  public async createPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.createPost(req.body);
      res.status(201).json(post);
    } catch (error: any) {
      // Log the actual error for server-side debugging
      logger.error('Error creating post:', error.message);
      
      // Send a more detailed error message to the client
      res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  }

  public async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  }

  public async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.getPostById(req.params.id);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error });
    }
  }

  public async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.updatePost(req.params.id, req.body);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating post', error });
    }
  }

  public async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const post = await postService.deletePost(req.params.id);
      if (post) {
        res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
  }
}

export default new PostController();
