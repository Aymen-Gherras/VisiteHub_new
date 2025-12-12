import fs from 'fs';
import path from 'path';
import { BlogFile, BlogMetadata } from './blogUtils';

// Function to extract metadata from HTML content
export function extractBlogMetadata(htmlContent: string): BlogMetadata {
  const metadata: BlogMetadata = {
    title: '',
    excerpt: '',
    author: 'Équipe VisiteHub',
    publishedAt: new Date().toISOString().split('T')[0],
    tags: [],
    featuredImage: undefined
  };

  // Extract title from <title> tag or first <h1>
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i) || 
                     htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Extract excerpt from meta description or first paragraph
  const excerptMatch = htmlContent.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
                       htmlContent.match(/<p[^>]*>(.*?)<\/p>/i);
  if (excerptMatch) {
    metadata.excerpt = excerptMatch[1].trim().substring(0, 150) + '...';
  }

  // Extract author from meta author or default
  const authorMatch = htmlContent.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"[^>]*>/i);
  if (authorMatch) {
    metadata.author = authorMatch[1].trim();
  }

  // Extract published date from meta date or default
  const dateMatch = htmlContent.match(/<meta[^>]*name="date"[^>]*content="([^"]*)"[^>]*>/i);
  if (dateMatch) {
    metadata.publishedAt = dateMatch[1].trim();
  }

  // Extract tags from meta keywords or default
  const tagsMatch = htmlContent.match(/<meta[^>]*name="keywords"[^>]*content="([^"]*)"[^>]*>/i);
  if (tagsMatch) {
    metadata.tags = tagsMatch[1].split(',').map(tag => tag.trim());
  } else {
    metadata.tags = ['Immobilier', 'Conseils'];
  }

  // Extract featured image from meta image or first img tag
  const imageMatch = htmlContent.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
                     htmlContent.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
  if (imageMatch) {
    metadata.featuredImage = imageMatch[1];
  }

  return metadata;
}

// Function to extract clean content from HTML (remove structure tags)
export function extractCleanContent(htmlContent: string): string {
  // Remove DOCTYPE, html, head, and body tags
  let cleanContent = htmlContent
    .replace(/<!DOCTYPE[^>]*>/i, '')
    .replace(/<html[^>]*>/i, '')
    .replace(/<\/html>/i, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/i, '')
    .replace(/<body[^>]*>/i, '')
    .replace(/<\/body>/i, '')
    .trim();

  // If no content found, try to extract from article tag
  if (!cleanContent || cleanContent.length < 50) {
    const articleMatch = htmlContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      cleanContent = articleMatch[1].trim();
    }
  }

  // If still no content, try to extract from main content area
  if (!cleanContent || cleanContent.length < 50) {
    // Remove common HTML structure elements
    cleanContent = htmlContent
      .replace(/<title[^>]*>[\s\S]*?<\/title>/i, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .trim();
  }

  return cleanContent;
}

// Function to read blog files from the blog directory
export async function readBlogFiles(): Promise<BlogFile[]> {
  try {
    const blogDir = path.join(process.cwd(), 'public', 'blog');
    
    // Check if blog directory exists
    if (!fs.existsSync(blogDir)) {
      console.log('Blog directory not found, creating it...');
      fs.mkdirSync(blogDir, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(blogDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    if (htmlFiles.length === 0) {
      console.log('No HTML files found in blog directory');
      return [];
    }
    
    const blogs: BlogFile[] = [];

    for (const file of htmlFiles) {
      try {
        const filePath = path.join(blogDir, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        
        // Extract metadata from HTML
        const metadata = extractBlogMetadata(htmlContent);
        
        // Extract clean content (without HTML structure)
        const cleanContent = extractCleanContent(htmlContent);
        
        // Generate slug from filename
        const slug = file.replace('.html', '');
        
        // Generate ID from filename
        const id = `file-${slug}`;
        
        blogs.push({
          id,
          slug,
          filename: file,
          content: cleanContent,
          ...metadata
        });
      } catch (error) {
        console.error(`Error reading blog file ${file}:`, error);
      }
    }

    // Sort by published date (newest first)
    return blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error('Error reading blog files:', error);
    return [];
  }
}

// Function to read a specific blog file by slug
export async function readBlogFile(slug: string): Promise<BlogFile | null> {
  try {
    const blogDir = path.join(process.cwd(), 'public', 'blog');
    const filePath = path.join(blogDir, `${slug}.html`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`Blog file not found: ${filePath}`);
      return null;
    }

    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const metadata = extractBlogMetadata(htmlContent);
    
    // Extract clean content (without HTML structure)
    const cleanContent = extractCleanContent(htmlContent);
    
    return {
      id: `file-${slug}`,
      slug,
      filename: `${slug}.html`,
      content: cleanContent,
      ...metadata
    };
  } catch (error) {
    console.error(`Error reading blog file ${slug}:`, error);
    return null;
  }
}

// Function to get all blog slugs for static generation
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const blogDir = path.join(process.cwd(), 'public', 'blog');
    
    if (!fs.existsSync(blogDir)) {
      return [];
    }

    const files = fs.readdirSync(blogDir);
    return files
      .filter(file => file.endsWith('.html'))
      .map(file => file.replace('.html', ''));
  } catch (error) {
    console.error('Error getting blog slugs:', error);
    return [];
  }
}
