// Client-side interfaces (can be imported in components)
export interface BlogFile {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featuredImage?: string;
  filename: string;
  slug: string;
}

export interface BlogMetadata {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featuredImage?: string;
}
