const axios = require('axios');

async function testBlogUpdate() {
  try {
    console.log('🧪 Testing blog update functionality...');
    
    // First, get a blog post to update
    const response = await axios.get('http://localhost:3000/api/blog');
    const posts = response.data.data;
    
    if (posts.length === 0) {
      console.log('❌ No blog posts found to test with');
      return;
    }
    
    const testPost = posts[0];
    console.log(`\n📝 Testing update with post: ${testPost.title}`);
    console.log(`   ID: ${testPost.id}`);
    console.log(`   Current title: ${testPost.title}`);
    
    // Test updating the title
    const updateData = {
      title: `Updated: ${testPost.title}`,
      excerpt: `Updated excerpt for ${testPost.title}`
    };
    
    console.log('\n🔄 Attempting to update blog post...');
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
    console.log(`   New excerpt: ${updateResponse.data.data.excerpt}`);
    
  } catch (error) {
    console.error('❌ Error testing blog update:', error.response?.data || error.message);
  }
}

testBlogUpdate();
