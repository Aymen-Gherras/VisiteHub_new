'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BlogPost } from '@/lib/blogTypes';
import { blogApi } from '@/api/blogApi';

const BlogPostPage = () => {
  const params = useParams();
  const postSlug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postSlug) {
      fetchBlogPost(postSlug);
      fetchAllPosts();
    }
  }, [postSlug]);

  const fetchBlogPost = async (slug: string) => {
    try {
      setLoading(true);
      const result = await blogApi.getPostBySlug(slug);
      
      if (result.success && result.data) {
        setPost(result.data);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const result = await blogApi.getPublishedPosts();
      if (result.success && Array.isArray(result.data)) {
        setAllPosts(result.data);
      }
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  };

  const getCurrentPostIndex = () => {
    if (!post || !allPosts.length) return -1;
    return allPosts.findIndex(p => p.id === post.id);
  };

  const getPreviousPost = () => {
    const currentIndex = getCurrentPostIndex();
    if (currentIndex > 0) {
      return allPosts[currentIndex - 1];
    }
    return null;
  };

  const getNextPost = () => {
    const currentIndex = getCurrentPostIndex();
    if (currentIndex >= 0 && currentIndex < allPosts.length - 1) {
      return allPosts[currentIndex + 1];
    }
    return null;
  };

  const getSimilarPosts = () => {
    if (!post || !allPosts.length) return [];
    return allPosts
      .filter(p => p.id !== post.id)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de l'article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Article non trouvé
            </h1>
            <p className="text-gray-600 mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Retour au blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const previousPost = getPreviousPost();
  const nextPost = getNextPost();
  const similarPosts = getSimilarPosts();

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section with Featured Image */}
            <div className="mb-8">
              {post.featuredImage && (
                <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl mb-6">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Optional: Add text overlay like Haousli */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}
              
              {/* Blog Post Metadata - Haousli Style */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">


                </div>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>

                </div>
              </div>

              {/* Blog Post Title */}
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-8">
                  <span className="text-gray-600 mr-2">🏷️</span>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Post Content */}
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                {/* Excerpt */}
                {post.excerpt && (
                  <div className="mb-8">
                    <p className="text-xl text-gray-700 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                {/* Main Content */}
                <div className="text-gray-800 leading-relaxed">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-base leading-7">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>

            {/* Social Share Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Partage Social</h3>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  <i className="fab fa-facebook mr-2"></i>
                  Facebook
                </button>
                <button className="bg-blue-400 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors font-medium">
                  <i className="fab fa-twitter mr-2"></i>
                  Twitter
                </button>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
                  <i className="fab fa-whatsapp mr-2"></i>
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previousPost && (
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className="block p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-sm text-gray-500 mb-2 font-medium">ARTICLE PRÉCÉDENT</div>
                    <div className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {previousPost.title}
                    </div>
                  </Link>
                )}
                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="block p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-sm text-gray-500 mb-2 font-medium">PROCHAIN ARTICLE</div>
                    <div className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {nextPost.title}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Similar Articles - Haousli Style */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Articles SIMILAIRES</h3>
              <div className="space-y-4">
                {similarPosts.map((similarPost) => (
                  <Link
                    key={similarPost.id}
                    href={`/blog/${similarPost.slug}`}
                    className="block group"
                  >
                    <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                      {/* Article Image */}
                      <div className="flex-shrink-0">
                        {similarPost.featuredImage ? (
                          <div className="h-20 w-20 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                            <img
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                              src={similarPost.featuredImage}
                              alt={similarPost.title}
                            />
                          </div>
                        ) : (
                          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center">
                            <span className="text-2xl text-gray-400">📷</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 text-sm leading-tight">
                          {similarPost.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">📅</span>
                          {new Date(similarPost.publishedAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        {similarPost.excerpt && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {similarPost.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {similarPosts.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-500 text-sm">Aucun article similaire trouvé</p>
                </div>
              )}
            </div>

            {/* Agent Promotion */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Vous êtes agent immobilier ou promoteur immobilier ?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Ajoutez votre agence sur VisiteHub ! Nous vous aiderons à développer votre carrière et à stimuler la croissance de votre entreprise.
              </p>
              <button className="w-full bg-white text-blue-600 px-4 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Inscrivez-vous aujourd'hui
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPostPage;
