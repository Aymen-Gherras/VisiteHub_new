import { NextRequest, NextResponse } from 'next/server';
import { readBlogFiles } from '@/lib/blogServerUtils';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching blog files...');
    const blogs = await readBlogFiles();
    
    console.log(`Found ${blogs.length} blog posts:`, blogs.map(b => ({ slug: b.slug, title: b.title })));
    
    return NextResponse.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Error fetching blog files:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
