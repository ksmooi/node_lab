import Post, { IPost } from './post';

class PostService {
  public async createPost(data: Partial<IPost>): Promise<IPost> {
    const post = new Post(data);
    return await post.save();
  }

  public async getAllPosts(): Promise<IPost[]> {
    return await Post.find();
  }

  public async getPostById(id: string): Promise<IPost | null> {
    return await Post.findById(id);
  }

  public async updatePost(id: string, data: Partial<IPost>): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(id, data, { new: true });
  }

  public async deletePost(id: string): Promise<IPost | null> {
    return await Post.findByIdAndDelete(id);
  }
}

export default new PostService();
