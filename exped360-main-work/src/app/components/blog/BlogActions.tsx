'use client';

import React from 'react';
import Link from 'next/link';

export const BlogActions: React.FC = () => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="text-gray-600 font-medium">Partager :</span>
        <button className="text-blue-600 hover:text-blue-700 text-xl">
          <i className="fab fa-facebook"></i>
        </button>
        <button className="text-blue-400 hover:text-blue-500 text-xl">
          <i className="fab fa-twitter"></i>
        </button>
        <button className="text-blue-800 hover:text-blue-900 text-xl">
          <i className="fab fa-linkedin"></i>
        </button>
      </div>
      
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Voir tous les articles
      </Link>
    </div>
  );
};
