import { NextRequest, NextResponse } from 'next/server';
import { readBlogFile } from '@/lib/blogServerUtils';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    console.log(`Fetching blog post with slug: ${slug}`);
    
    if (!slug) {
      console.log('No slug provided');
      return NextResponse.json({
        success: false,
        error: 'Slug is required'
      }, { status: 400 });
    }

    const blog = await readBlogFile(slug);
    
    if (!blog) {
      console.log(`Blog post not found for slug: ${slug}`);
      return NextResponse.json({
        success: false,
        error: 'Blog post not found'
      }, { status: 404 });
    }

    console.log(`Successfully fetched blog post: ${blog.title}`);
    
    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
