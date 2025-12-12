import { apiService } from './index';
import { BlogPost, CreateBlogPostDto, UpdateBlogPostDto, BlogAnalytics, BlogPostStatus } from '@/lib/blogTypes';

export const blogApi = {
  // Get all blog posts
  getAllPosts: () => apiService.getAllPosts(),

  // Get published posts only
  getPublishedPosts: () => apiService.getPublishedPosts(),

  // Get a specific post by ID
  getPost: (id: string) => apiService.getPost(id),

  // Get a specific post by slug
  getPostBySlug: (slug: string) => apiService.getPostBySlug(slug),

  // Create a new blog post
  createPost: (data: CreateBlogPostDto) => apiService.createPost(data),

  // Update an existing blog post
  updatePost: (id: string, data: UpdateBlogPostDto) => apiService.updatePost(id, data),

  // Update post status
  updatePostStatus: (id: string, status: BlogPostStatus) => apiService.updatePostStatus(id, status),

  // Delete a blog post
  deletePost: (id: string) => apiService.deletePost(id),

  // Upload featured image for a post
  uploadPostImage: (id: string, file: File) => apiService.uploadPostImage(id, file),

  // Delete featured image for a post
  deletePostImage: (id: string) => apiService.deletePostImage(id),

  // Increment view count
  incrementPostView: (id: string) => apiService.incrementPostView(id),

  // Increment like count
  incrementPostLike: (id: string) => apiService.incrementPostLike(id),

  // Get blog analytics
  getAnalytics: () => apiService.getBlogAnalytics(),
};
