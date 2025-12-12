'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BlogGrid, BlogPagination } from '@/app/components/blog';
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
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4 leading-tight">
                Blog <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">VisiteHub</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
                Actualités, conseils et guides pour réussir dans l'immobilier en Algérie
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4 leading-tight">
                Blog <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">VisiteHub</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
                Actualités, conseils et guides pour réussir dans l'immobilier en Algérie
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-3 md:p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <button
                  onClick={fetchBlogPosts}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4 leading-tight">
              Blog <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">VisiteHub</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Actualités, conseils et guides pour réussir dans l'immobilier en Algérie
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <BlogGrid posts={paginatedPosts} />

        {posts.length > pageSize && (
          <div className="mt-6 md:mt-8 mb-8 md:mb-12">
            <BlogPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4 leading-tight">
                Blog <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">VisiteHub</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
                Actualités, conseils et guides pour réussir dans l'immobilier en Algérie
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-emerald-600 mx-auto"></div>
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
