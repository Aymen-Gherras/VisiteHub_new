const axios = require('axios');

async function createTestBlog() {
  try {
    console.log('📝 Creating test blog post...');
    
    const testBlogData = {
      slug: 'test-blog-post-for-update',
      title: 'Test Blog Post for Update Testing',
      excerpt: 'This is a test blog post to verify the update functionality works correctly.',
      content: 'This is the content of the test blog post. It contains enough text to test various update scenarios including title changes, content updates, and SEO field modifications.',
      author: 'Test Author',
      tags: ['test', 'update', 'validation'],
      status: 'published',
      publishedAt: '2024-01-01',
      seoTitle: 'Test Blog Post - SEO Title',
      seoDescription: 'Test blog post for verifying update functionality and DTO validation',
      seoKeywords: ['test', 'blog', 'update', 'validation', 'dto'],
      canonicalUrl: 'https://test.example.com/blog/test-post'
    };
    
    console.log('📤 Creating blog post with data:', JSON.stringify(testBlogData, null, 2));
    
    const response = await axios.post(
      'http://localhost:3000/api/blog',
      testBlogData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Test blog post created successfully!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Title: ${response.data.data.title}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   Status: ${response.data.data.status}`);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error creating test blog post:', error.response?.data || error.message);
    
    if (error.response?.data) {
      console.error('📋 Response details:');
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message);
      console.error('   Error:', error.response.data.error);
    }
    
    // Check if it's a conflict (blog post already exists)
    if (error.response?.status === 409) {
      console.log('ℹ️  Blog post already exists, trying to fetch it...');
      try {
        const response = await axios.get('http://localhost:3000/api/blog/slug/test-blog-post-for-update');
        console.log('✅ Found existing test blog post:');
        console.log(`   ID: ${response.data.data.id}`);
        console.log(`   Title: ${response.data.data.title}`);
        return response.data.data;
      } catch (fetchError) {
        console.error('❌ Error fetching existing blog post:', fetchError.message);
      }
    }
    
    return null;
  }
}

createTestBlog();
