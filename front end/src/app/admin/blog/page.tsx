'use client';

import React, { useState, useEffect } from 'react';
import { BlogForm } from '@/app/components/blog/admin/BlogForm';
import type { BlogFormData } from '@/app/components/blog/admin/BlogForm';
import { BlogTable } from '@/app/components/blog/admin/BlogTable';
import { BlogAnalytics } from '@/app/components/blog/admin/BlogAnalytics';
import { BlogPost, BlogPostStatus, BlogAnalytics as BlogAnalyticsType } from '@/lib/blogTypes';
import { blogApi } from '@/api/blogApi';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<BlogAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchAnalytics();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAllPosts();
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await blogApi.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  type AdminSubmitPost = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount'> & { imageFile?: File | null };

  const handleCreatePost = async (postData: AdminSubmitPost) => {
    try {
      setFormLoading(true);
      
      // Extract image file and other data
      const { imageFile, ...postDataWithoutImage } = postData;
      
      // Create the post first
      const response = await blogApi.createPost(postDataWithoutImage);
      if (response.success) {
        // If there's an image, upload it
        if (imageFile && response.data.id) {
          try {
            await blogApi.uploadPostImage(response.data.id, imageFile);
          } catch (imageError) {
            console.error('Error uploading image:', imageError);
          }
        }
        
        setShowForm(false);
        fetchPosts();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePost = async (postData: Partial<BlogPost> & { imageFile?: File | null }) => {
    if (!editingPost) return;
    
    try {
      setFormLoading(true);
      // Only send allowed fields for update
      const updateData = {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        author: postData.author,
        tags: postData.tags,
        status: postData.status,
        publishedAt: postData.publishedAt,
        seoTitle: postData.seoTitle,
        seoDescription: postData.seoDescription,
        seoKeywords: postData.seoKeywords,
        canonicalUrl: postData.canonicalUrl,
      };
      
      const response = await blogApi.updatePost(editingPost.id, updateData);
      if (response.success) {
        // If there's a new image, upload it
        if (postData.imageFile) {
          try {
            await blogApi.uploadPostImage(editingPost.id, postData.imageFile);
          } catch (imageError) {
            console.error('Error uploading image:', imageError);
          }
        }
        
        setEditingPost(null);
        fetchPosts();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const response = await blogApi.deletePost(id);
      if (response.success) {
        fetchPosts();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleStatusChange = async (id: string, status: BlogPostStatus) => {
    try {
      const response = await blogApi.updatePostStatus(id, status);
      if (response.success) {
        fetchPosts();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const handleSubmit = (postData: BlogFormData) => {
    if (editingPost) {
      handleUpdatePost(postData);
    } else {
      handleCreatePost(postData);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion du Blog</h1>
              <p className="text-gray-600">Créez, modifiez et gérez vos articles de blog</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              ✨ Nouvel article
            </button>
          </div>
        </div>

        {analytics && <BlogAnalytics analytics={analytics} loading={loading} />}
      </div>

      {showForm ? (
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingPost ? 'Modifier l\'article' : 'Créer un nouvel article'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕ Fermer
              </button>
            </div>
            <BlogForm
              post={editingPost || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={formLoading}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Articles du Blog</h2>
              <button
                onClick={() => window.location.reload()}
                className="text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                🔄 Rafraîchir
              </button>
            </div>
          </div>
          <BlogTable
            posts={posts}
            onEdit={handleEdit}
            onDelete={handleDeletePost}
            onStatusChange={handleStatusChange}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
