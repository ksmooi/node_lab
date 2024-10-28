// src/apps/blog_apps/client/blogClient.ts
import inquirer from 'inquirer';
import ApiService from './apiService';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

class BlogClient {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  public async start() {
    console.log('Welcome to the Blog Application CLI Client!\n');
    let exit = false;
    while (!exit) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Select an action:',
          choices: [
            'Create a New Post',
            'View All Posts',
            'View a Post by ID',
            'Update a Post',
            'Delete a Post',
            'Exit',
          ],
        },
      ]);

      switch (action) {
        case 'Create a New Post':
          await this.createPost();
          break;
        case 'View All Posts':
          await this.viewAllPosts();
          break;
        case 'View a Post by ID':
          await this.viewPostById();
          break;
        case 'Update a Post':
          await this.updatePost();
          break;
        case 'Delete a Post':
          await this.deletePost();
          break;
        case 'Exit':
          exit = true;
          console.log('Goodbye!');
          break;
      }
    }
  }

  private async createPost() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the post title:',
        validate: (input) => (input ? true : 'Title cannot be empty.'),
      },
      {
        type: 'input',
        name: 'content',
        message: 'Enter the post content:',
        validate: (input) => (input ? true : 'Content cannot be empty.'),
      },
      {
        type: 'input',
        name: 'author',
        message: 'Enter the author name:',
        validate: (input) => (input ? true : 'Author cannot be empty.'),
      },
    ]);

    try {
      const newPost = await this.apiService.createPost(answers);
      console.log('\nPost created successfully!');
      console.log(newPost);
    } catch (error: any) {
      console.log(`\n${error.message}`);
    }
  }

  private async viewAllPosts() {
    try {
      const posts: Post[] = await this.apiService.getAllPosts();
      if (posts.length === 0) {
        console.log('\nNo posts found.');
        return;
      }
      console.log('\nAll Blog Posts:\n');
      posts.forEach((post, index) => {
        console.log(
          `${index + 1}. ${post.title} by ${post.author} (ID: ${post._id})`
        );
        console.log(`   Created At: ${post.createdAt}`);
        console.log(`   Updated At: ${post.updatedAt}\n`);
      });
    } catch (error: any) {
      console.log(`\n${error.message}`);
    }
  }

  private async viewPostById() {
    const { id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter the Post ID:',
        validate: (input) => (input ? true : 'Post ID cannot be empty.'),
      },
    ]);

    try {
      const post: Post = await this.apiService.getPostById(id);
      console.log('\nPost Details:\n');
      console.log(`Title: ${post.title}`);
      console.log(`Author: ${post.author}`);
      console.log(`Content: ${post.content}`);
      console.log(`Created At: ${post.createdAt}`);
      console.log(`Updated At: ${post.updatedAt}\n`);
    } catch (error: any) {
      console.log(`\n${error.message}`);
    }
  }

  private async updatePost() {
    const { id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter the Post ID to update:',
        validate: (input) => (input ? true : 'Post ID cannot be empty.'),
      },
    ]);

    try {
      const post: Post = await this.apiService.getPostById(id);
      if (!post) {
        console.log('\nPost not found.');
        return;
      }

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: `Enter new title (${post.title}):`,
          default: post.title,
        },
        {
          type: 'input',
          name: 'content',
          message: `Enter new content:`,
          default: post.content,
        },
        {
          type: 'input',
          name: 'author',
          message: `Enter new author (${post.author}):`,
          default: post.author,
        },
      ]);

      const updatedPost = await this.apiService.updatePost(id, answers);
      console.log('\nPost updated successfully!');
      console.log(updatedPost);
    } catch (error: any) {
      console.log(`\n${error.message}`);
    }
  }

  private async deletePost() {
    const { id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter the Post ID to delete:',
        validate: (input) => (input ? true : 'Post ID cannot be empty.'),
      },
    ]);

    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: `Are you sure you want to delete the post with ID ${id}?`,
        default: false,
      },
    ]);

    if (!confirm.confirmDelete) {
      console.log('\nDeletion cancelled.');
      return;
    }

    try {
      await this.apiService.deletePost(id);
      console.log('\nPost deleted successfully!');
    } catch (error: any) {
      console.log(`\n${error.message}`);
    }
  }
}

export default BlogClient;
