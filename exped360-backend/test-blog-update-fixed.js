const axios = require('axios');

async function testBlogUpdateFixed() {
  try {
    console.log('🧪 Testing fixed blog update functionality...');
    
    // First, get a blog post to update
    const response = await axios.get('http://localhost:3000/api/blog');
    const posts = response.data.data;
    
    if (posts.length === 0) {
      console.log('❌ No blog posts found to test with');
      console.log('💡 You may need to create a blog post first');
      return;
    }
    
    const testPost = posts[0];
    console.log(`\n📝 Testing update with post: ${testPost.title}`);
    console.log(`   ID: ${testPost.id}`);
    console.log(`   Current title: ${testPost.title}`);
    console.log(`   Current slug: ${testPost.slug}`);
    
    // Test updating the title and other fields
    const updateData = {
      title: `Updated: ${testPost.title}`,
      excerpt: `Updated excerpt for ${testPost.title}`,
      content: `Updated content for ${testPost.title}. This is a test update to verify the DTO validation is working correctly.`,
      tags: ['test', 'update', 'validation'],
      seoTitle: `Updated SEO Title for ${testPost.title}`,
      seoDescription: `Updated SEO description for the blog post about ${testPost.title}`,
      seoKeywords: ['updated', 'seo', 'keywords', 'test']
    };
    
    console.log('\n🔄 Attempting to update blog post...');
    console.log('📤 Update payload:', JSON.stringify(updateData, null, 2));
    
    const updateResponse = await axios.patch(
      `http://localhost:3000/api/blog/${testPost.id}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Blog post updated successfully!');
    console.log(`   New title: ${updateResponse.data.data.title}`);
    console.log(`   New slug: ${updateResponse.data.data.slug}`);
    console.log(`   New excerpt: ${updateResponse.data.data.excerpt}`);
    console.log(`   New tags: ${updateResponse.data.data.tags.join(', ')}`);
    
    // Verify that system-managed fields were not changed
    console.log(`\n🔒 System-managed fields (should be unchanged):`);
    console.log(`   ID: ${updateResponse.data.data.id} (unchanged: ${updateResponse.data.data.id === testPost.id})`);
    console.log(`   View count: ${updateResponse.data.data.viewCount} (unchanged: ${updateResponse.data.data.viewCount === testPost.viewCount})`);
    console.log(`   Like count: ${updateResponse.data.data.likeCount} (unchanged: ${updateResponse.data.data.likeCount === testPost.likeCount})`);
    console.log(`   Created at: ${updateResponse.data.data.createdAt} (unchanged: ${updateResponse.data.data.createdAt === testPost.createdAt})`);
    
  } catch (error) {
    console.error('❌ Error testing blog update:', error.response?.data || error.message);
    
    if (error.response?.data) {
      console.error('📋 Response details:');
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message);
      console.error('   Error:', error.response.data.error);
    }
  }
}

testBlogUpdateFixed();
