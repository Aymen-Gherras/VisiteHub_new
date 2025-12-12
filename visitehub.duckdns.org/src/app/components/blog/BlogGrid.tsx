'use client';

import React from 'react';
import { BlogCard } from './BlogCard';
import { BlogPost } from '@/lib/blogTypes';

interface BlogGridProps {
  posts: BlogPost[];
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Aucun article pour le moment
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Notre équipe prépare du contenu passionnant sur l'immobilier en Algérie. Revenez bientôt !
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        Tous les articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
