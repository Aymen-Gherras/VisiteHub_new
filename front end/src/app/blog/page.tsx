'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BlogHeader, BlogGrid, BlogPagination } from '@/app/components/blog';
import { BlogPost } from '@/lib/blogTypes';
import { blogApi } from '@/api/blogApi';

const BlogPageContent = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 6;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [searchParams]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      // Use the apiService to fetch published posts
      const result = await blogApi.getPublishedPosts();
      
      if (result.success && Array.isArray(result.data)) {
        setPosts(result.data);
      } else {
        setError('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * pageSize;
  const paginatedPosts = posts.slice(start, start + pageSize);

  const handlePageChange = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (p <= 1) sp.delete('page'); else sp.set('page', String(p));
    router.push(`${pathname}${sp.toString() ? `?${sp.toString()}` : ''}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchBlogPosts}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogHeader />
        <BlogGrid posts={paginatedPosts} />

        {posts.length > pageSize && (
          <div className="mt-10">
            <BlogPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </main>
  );
};

const BlogPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
};

export default BlogPage;
