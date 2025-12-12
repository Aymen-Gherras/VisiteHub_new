'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blogTypes';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
      {/* Featured Image */}
      <div className="relative h-56 overflow-hidden">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl text-gray-400">📷</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        

      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-200"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full font-medium border border-gray-200">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="mr-2">👤</span>
              <span className="font-medium">{post.author}</span>
            </span>
            <span className="flex items-center">
              <span className="mr-2">📅</span>
              <span className="font-medium">{formatDate(post.publishedAt)}</span>
            </span>
          </div>
          
          {/* Statistics */}

        </div>

        {/* Read More Button */}
        <div className="pt-4 border-t border-gray-100">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Lire l'article
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
