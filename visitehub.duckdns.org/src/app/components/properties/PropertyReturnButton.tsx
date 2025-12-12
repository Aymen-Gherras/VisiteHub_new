'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export const PropertyReturnButton: React.FC = () => {
  const router = useRouter();

  const handleReturn = () => {
    router.back();
  };

  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={handleReturn}
        className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <i className="fas fa-arrow-left text-sm"></i>
        <span className="text-sm font-medium">Retour</span>
      </button>
    </div>
  );
};

