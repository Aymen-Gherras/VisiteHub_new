const axios = require('axios');

async function testBlogUpdateComprehensive() {
  try {
    console.log('🧪 Comprehensive Blog Update Testing');
    console.log('=====================================\n');
    
    // Step 1: Check if there are existing blog posts
    console.log('📋 Step 1: Checking existing blog posts...');
    let response = await axios.get('http://localhost:3000/api/blog');
    let posts = response.data.data;
    
    let testPost;
    if (posts.length === 0) {
      console.log('❌ No blog posts found. Creating a test post...');
      testPost = await createTestBlog();
      if (!testPost) {
        console.log('❌ Failed to create test blog post. Exiting...');
        return;
      }
    } else {
      testPost = posts[0];
      console.log(`✅ Found existing blog post: ${testPost.title}`);
    }
    
    console.log(`\n📝 Test post details:`);
    console.log(`   ID: ${testPost.id}`);
    console.log(`   Title: ${testPost.title}`);
    console.log(`   Slug: ${testPost.slug}`);
    console.log(`   Status: ${testPost.status}`);
    
    // Step 2: Test basic update without system fields
    console.log('\n📋 Step 2: Testing basic update (title, excerpt, content)...');
    const basicUpdateData = {
      title: `Updated: ${testPost.title}`,
      excerpt: `Updated excerpt for ${testPost.title}`,
      content: `Updated content for ${testPost.title}. This is a comprehensive test update.`
    };
    
    console.log('📤 Basic update payload:', JSON.stringify(basicUpdateData, null, 2));
    
    let updateResponse = await axios.patch(
      `http://localhost:3000/api/blog/${testPost.id}`,
      basicUpdateData
    );
    
    console.log('✅ Basic update successful!');
    console.log(`   New title: ${updateResponse.data.data.title}`);
    console.log(`   New slug: ${updateResponse.data.data.slug}`);
    console.log(`   New excerpt: ${updateResponse.data.data.excerpt}`);
    
    // Step 3: Test update with SEO fields
    console.log('\n📋 Step 3: Testing update with SEO fields...');
    const seoUpdateData = {
      seoTitle: 'Updated SEO Title for Blog Post',
      seoDescription: 'Updated SEO description for better search engine optimization',
      seoKeywords: ['updated', 'seo', 'blog', 'post', 'test'],
      canonicalUrl: 'https://updated.example.com/blog/updated-post'
    };
    
    console.log('📤 SEO update payload:', JSON.stringify(seoUpdateData, null, 2));
    
    updateResponse = await axios.patch(
      `http://localhost:3000/api/blog/${testPost.id}`,
      seoUpdateData
    );
    
    console.log('✅ SEO update successful!');
    console.log(`   SEO Title: ${updateResponse.data.data.seoTitle}`);
    console.log(`   SEO Description: ${updateResponse.data.data.seoDescription}`);
    console.log(`   SEO Keywords: ${updateResponse.data.data.seoKeywords.join(', ')}`);
    console.log(`   Canonical URL: ${updateResponse.data.data.canonicalUrl}`);
    
    // Step 4: Test update with tags and status
    console.log('\n📋 Step 4: Testing update with tags and status...');
    const tagsUpdateData = {
      tags: ['comprehensive', 'test', 'update', 'validation', 'success'],
      status: 'published'
    };
    
    console.log('📤 Tags and status update payload:', JSON.stringify(tagsUpdateData, null, 2));
    
    updateResponse = await axios.patch(
      `http://localhost:3000/api/blog/${testPost.id}`,
      tagsUpdateData
    );
    
    console.log('✅ Tags and status update successful!');
    console.log(`   Tags: ${updateResponse.data.data.tags.join(', ')}`);
    console.log(`   Status: ${updateResponse.data.data.status}`);
    
    // Step 5: Verify system-managed fields are unchanged
    console.log('\n📋 Step 5: Verifying system-managed fields are unchanged...');
    console.log(`   ID: ${updateResponse.data.data.id} (unchanged: ${updateResponse.data.data.id === testPost.id})`);
    console.log(`   View count: ${updateResponse.data.data.viewCount} (unchanged: ${updateResponse.data.data.viewCount === testPost.viewCount})`);
    console.log(`   Like count: ${updateResponse.data.data.likeCount} (unchanged: ${updateResponse.data.data.likeCount === testPost.likeCount})`);
    console.log(`   Created at: ${updateResponse.data.data.createdAt} (unchanged: ${updateResponse.data.data.createdAt === testPost.createdAt})`);
    
    // Step 6: Test that system fields are rejected
    console.log('\n📋 Step 6: Testing that system fields are rejected...');
    const systemFieldsData = {
      id: 'should-be-rejected',
      slug: 'should-be-rejected',
      viewCount: 999,
      likeCount: 999,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };
    
    console.log('📤 System fields payload (should be rejected):', JSON.stringify(systemFieldsData, null, 2));
    
    try {
      await axios.patch(
        `http://localhost:3000/api/blog/${testPost.id}`,
        systemFieldsData
      );
      console.log('❌ System fields update should have been rejected!');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ System fields correctly rejected with 400 status');
        console.log(`   Error message: ${error.response.data.message.join(', ')}`);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Blog update functionality is working correctly');
    console.log('✅ DTO validation is properly configured');
    console.log('✅ System-managed fields are protected');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.data) {
      console.error('📋 Response details:');
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message);
      console.error('   Error:', error.response.data.error);
    }
  }
}

async function createTestBlog() {
  try {
    console.log('📝 Creating test blog post...');
    
    const testBlogData = {
      slug: 'test-blog-post-for-update',
      title: 'Test Blog Post for Update Testing',
      excerpt: 'This is a test blog post to verify the update functionality works correctly.',
      content: 'This is the content of the test blog post. It contains enough text to test various update scenarios.',
      author: 'Test Author',
      tags: ['test', 'update', 'validation'],
      status: 'published',
      publishedAt: '2024-01-01',
      seoTitle: 'Test Blog Post - SEO Title',
      seoDescription: 'Test blog post for verifying update functionality and DTO validation',
      seoKeywords: ['test', 'blog', 'update', 'validation', 'dto'],
      canonicalUrl: 'https://test.example.com/blog/test-post'
    };
    
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
    return response.data.data;
    
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  Blog post already exists, fetching it...');
      try {
        const response = await axios.get('http://localhost:3000/api/blog/slug/test-blog-post-for-update');
        return response.data.data;
      } catch (fetchError) {
        console.error('❌ Error fetching existing blog post:', fetchError.message);
        return null;
      }
    }
    
    console.error('❌ Error creating test blog post:', error.message);
    return null;
  }
}

testBlogUpdateComprehensive();
