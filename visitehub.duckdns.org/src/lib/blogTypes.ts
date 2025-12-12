export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  featuredImage?: string | null;
  featuredImagePublicId?: string | null;
  status: BlogPostStatus;
  publishedAt: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
  canonicalUrl?: string | null;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostDto {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  featuredImage?: string | null;
  featuredImagePublicId?: string | null;
  status: BlogPostStatus;
  publishedAt: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
  canonicalUrl?: string | null;
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {}

export interface BlogAnalytics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  totalViews: number;
  totalLikes: number;
}
