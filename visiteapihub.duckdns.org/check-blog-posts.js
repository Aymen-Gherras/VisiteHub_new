const axios = require('axios');

async function checkBlogPosts() {
  try {
    console.log('🔍 Checking blog posts in database...');
    
    // Check all posts
    const allPostsResponse = await axios.get('http://localhost:3000/api/blog');
    console.log('\n📊 All blog posts:');
    console.log(`Total posts: ${allPostsResponse.data.data.length}`);
    
    allPostsResponse.data.data.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   ID: ${post.id}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Author: ${post.author}`);
      console.log(`   Published: ${post.publishedAt}`);
    });
    
    // Check published posts
    const publishedResponse = await axios.get('http://localhost:3000/api/blog?status=published');
    console.log('\n✅ Published blog posts:');
    console.log(`Total published: ${publishedResponse.data.data.length}`);
    
    publishedResponse.data.data.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Status: ${post.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking blog posts:', error.message);
  }
}

checkBlogPosts();
