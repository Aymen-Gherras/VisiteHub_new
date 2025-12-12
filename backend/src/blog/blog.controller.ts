import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { DisableCache } from '../common/decorators/disable-cache.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { UpdateBlogSlugDto } from './dto/update-blog-slug.dto';
import { BlogPostStatus } from './entities/blog-post.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto).then(post => ({
      success: true,
      data: post
    }));
  }

  @Get()
  // Note: Caching is enabled with 30-second TTL via SmartCacheInterceptor
  // This provides fresh data while still benefiting from cache performance
  findAll(@Query('status') status?: BlogPostStatus) {
    if (status === BlogPostStatus.PUBLISHED) {
      return this.blogService.findPublished().then(posts => ({
        success: true,
        data: posts
      }));
    }
    return this.blogService.findAll().then(posts => ({
      success: true,
      data: posts
    }));
  }

  @Get('analytics')
  getAnalytics() {
    return this.blogService.getAnalytics().then(analytics => ({
      success: true,
      data: analytics
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id).then(post => ({
      success: true,
      data: post
    }));
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug).then(post => ({
      success: true,
      data: post
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.update(id, updateBlogPostDto).then(post => ({
      success: true,
      data: post
    }));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: BlogPostStatus) {
    return this.blogService.updateStatus(id, status).then(post => ({
      success: true,
      data: post
    }));
  }

  @Patch(':id/slug')
  updateSlug(@Param('id') id: string, @Body() updateBlogSlugDto: UpdateBlogSlugDto) {
    return this.blogService.updateSlug(id, updateBlogSlugDto.slug).then(post => ({
      success: true,
      data: post
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id).then(() => ({
      success: true,
      message: 'Blog post deleted successfully'
    }));
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  uploadFeaturedImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.blogService.uploadFeaturedImage(file, id).then(post => ({
      success: true,
      data: post
    }));
  }

  @Delete(':id/delete-image')
  deleteFeaturedImage(@Param('id') id: string) {
    return this.blogService.deleteFeaturedImage(id).then(post => ({
      success: true,
      data: post
    }));
  }

  @Post(':id/increment-view')
  incrementViewCount(@Param('id') id: string) {
    return this.blogService.incrementViewCount(id).then(() => ({
      success: true,
      message: 'View count incremented'
    }));
  }

  @Post(':id/increment-like')
  incrementLikeCount(@Param('id') id: string) {
    return this.blogService.incrementLikeCount(id).then(() => ({
      success: true,
      message: 'Like count incremented'
    }));
  }
}
