'use client';

import React from 'react';

interface BlogPost {
  title: string;
  tags: string[];
  author: string;
  publishedAt: string;
  featuredImage?: string | null;
}

interface BlogPostHeaderProps {
  post: BlogPost;
}

export const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      {post.featuredImage && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 sm:p-8">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          <span className="flex items-center">
            <i className="fas fa-user mr-2"></i>
            {post.author}
          </span>
          <span className="flex items-center">
            <i className="fas fa-calendar mr-2"></i>
            {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </article>
  );
};
