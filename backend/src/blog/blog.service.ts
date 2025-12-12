import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { BlogPost, BlogPostStatus } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CacheInvalidationService } from '../common/services/cache-invalidation.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    private cloudinaryService: CloudinaryService,
    private cacheInvalidationService: CacheInvalidationService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    // Check if slug already exists
    const existingPost = await this.blogPostRepository.findOne({
      where: { slug: createBlogPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('A blog post with this slug already exists');
    }

    const blogPost = this.blogPostRepository.create(createBlogPostDto);
    const saved = await this.blogPostRepository.save(blogPost);
    
    // Invalidate cache after creating blog post
    await this.cacheInvalidationService.invalidateBlog();
    
    return saved;
  }

  async findAll(): Promise<BlogPost[]> {
    return await this.blogPostRepository.find({
      order: { publishedAt: 'DESC' },
    });
  }

  async findPublished(): Promise<BlogPost[]> {
    return await this.blogPostRepository.find({
      where: { status: BlogPostStatus.PUBLISHED },
      order: { publishedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({
      where: { id },
    });

    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }

    return blogPost;
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({
      where: { slug },
    });

    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }

    return blogPost;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const blogPost = await this.findOne(id);

    // If title is being updated, generate a new slug
    if (updateBlogPostDto.title && updateBlogPostDto.title !== blogPost.title) {
      const newSlug = this.generateSlug(updateBlogPostDto.title);
      
      // Check if the new slug conflicts with existing posts
      const existingPost = await this.blogPostRepository.findOne({
        where: { slug: newSlug, id: Not(id) },
      });

      if (existingPost) {
        // If slug conflicts, append a number to make it unique
        let counter = 1;
        let uniqueSlug = `${newSlug}-${counter}`;
        
        while (await this.blogPostRepository.findOne({ where: { slug: uniqueSlug, id: Not(id) } })) {
          counter++;
          uniqueSlug = `${newSlug}-${counter}`;
        }
        
        // Update the slug directly on the blog post entity, not on the DTO
        blogPost.slug = uniqueSlug;
      } else {
        // Update the slug directly on the blog post entity, not on the DTO
        blogPost.slug = newSlug;
      }
    }

    // Apply other updates from the DTO
    Object.assign(blogPost, updateBlogPostDto);
    const saved = await this.blogPostRepository.save(blogPost);
    
    // Invalidate cache after updating blog post
    await this.cacheInvalidationService.invalidateBlogPost(id);
    
    return saved;
  }

  async remove(id: string): Promise<void> {
    const blogPost = await this.findOne(id);

    // Delete featured image from Cloudinary if it exists
    if (blogPost.featuredImagePublicId) {
      try {
        await this.cloudinaryService.deleteImage(blogPost.featuredImagePublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await this.blogPostRepository.remove(blogPost);
    
    // Invalidate cache after deleting blog post
    await this.cacheInvalidationService.invalidateBlogPost(id);
  }

  async updateStatus(id: string, status: BlogPostStatus): Promise<BlogPost> {
    const blogPost = await this.findOne(id);
    blogPost.status = status;
    const saved = await this.blogPostRepository.save(blogPost);
    
    // Invalidate cache after updating status
    await this.cacheInvalidationService.invalidateBlogPost(id);
    
    return saved;
  }

  async updateSlug(id: string, newSlug: string): Promise<BlogPost> {
    const blogPost = await this.findOne(id);
    
    // Check if the new slug conflicts with existing posts
    const existingPost = await this.blogPostRepository.findOne({
      where: { slug: newSlug, id: Not(id) },
    });

    if (existingPost) {
      throw new ConflictException('A blog post with this slug already exists');
    }

    blogPost.slug = newSlug;
    const saved = await this.blogPostRepository.save(blogPost);
    
    // Invalidate cache after updating slug
    await this.cacheInvalidationService.invalidateBlogPost(id);
    
    return saved;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.blogPostRepository.increment({ id }, 'viewCount', 1);
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.blogPostRepository.increment({ id }, 'likeCount', 1);
  }

  async uploadFeaturedImage(file: Express.Multer.File, blogPostId: string): Promise<BlogPost> {
    const blogPost = await this.findOne(blogPostId);

    // Delete previous image if it exists
    if (blogPost.featuredImagePublicId) {
      try {
        await this.cloudinaryService.deleteImage(blogPost.featuredImagePublicId);
      } catch (error) {
        console.error('Error deleting previous image from Cloudinary:', error);
      }
    }

    // Upload new image
    const uploadResult = await this.cloudinaryService.uploadImageWithResult(file, 'blog-featured');

    // Update blog post with new image
    blogPost.featuredImage = uploadResult.secure_url;
    blogPost.featuredImagePublicId = uploadResult.public_id;

    return await this.blogPostRepository.save(blogPost);
  }

  async deleteFeaturedImage(blogPostId: string): Promise<BlogPost> {
    const blogPost = await this.findOne(blogPostId);

    if (blogPost.featuredImagePublicId) {
      try {
        await this.cloudinaryService.deleteImage(blogPost.featuredImagePublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }

      blogPost.featuredImage = null;
      blogPost.featuredImagePublicId = null;

      return await this.blogPostRepository.save(blogPost);
    }

    return blogPost;
  }

  async getAnalytics(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    archivedPosts: number;
    totalViews: number;
    totalLikes: number;
  }> {
    const [totalPosts, publishedPosts, draftPosts, archivedPosts] = await Promise.all([
      this.blogPostRepository.count(),
      this.blogPostRepository.count({ where: { status: BlogPostStatus.PUBLISHED } }),
      this.blogPostRepository.count({ where: { status: BlogPostStatus.DRAFT } }),
      this.blogPostRepository.count({ where: { status: BlogPostStatus.ARCHIVED } }),
    ]);

    const [totalViews, totalLikes] = await Promise.all([
      this.blogPostRepository
        .createQueryBuilder('post')
        .select('SUM(post.viewCount)', 'total')
        .getRawOne()
        .then(result => parseInt(result.total) || 0),
      this.blogPostRepository
        .createQueryBuilder('post')
        .select('SUM(post.likeCount)', 'total')
        .getRawOne()
        .then(result => parseInt(result.total) || 0),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalViews,
      totalLikes,
    };
  }
}
