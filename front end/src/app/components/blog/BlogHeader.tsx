'use client';

import React from 'react';

export const BlogHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Blog VisiteHub
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Actualités, conseils et guides pour réussir dans l'immobilier en Algérie
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="flex justify-center items-center space-x-4 text-gray-400">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
      </div>
    </div>
  );
};
