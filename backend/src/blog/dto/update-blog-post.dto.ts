import { IsString, IsOptional, IsArray, IsEnum, IsDateString } from 'class-validator';
import { BlogPostStatus } from '../entities/blog-post.entity';

export class UpdateBlogPostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  author?: string;

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
  @IsOptional()
  publishedAt?: string;

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
