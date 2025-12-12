import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsDateString } from 'class-validator';
import { BlogPostStatus } from '../entities/blog-post.entity';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  featuredImage?: string | null;

  @IsString()
  @IsOptional()
  featuredImagePublicId?: string | null;

  @IsEnum(BlogPostStatus)
  @IsOptional()
  status?: BlogPostStatus;

  @IsDateString()
  @IsNotEmpty()
  publishedAt: string;

  @IsString()
  @IsOptional()
  seoTitle?: string | null;

  @IsString()
  @IsOptional()
  seoDescription?: string | null;

  @IsArray()
  @IsOptional()
  seoKeywords?: string[] | null;

  @IsString()
  @IsOptional()
  canonicalUrl?: string | null;
}
