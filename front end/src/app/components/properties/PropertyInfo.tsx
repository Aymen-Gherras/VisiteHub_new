'use client';

import React from 'react';

type PropertyInfoProps = {
  title: string;
  price: string | number;
  transactionType: 'vendre' | 'location';
  type: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  surface: number;
  bedrooms?: number;
  etage?: number;
};

export const PropertyInfo: React.FC<PropertyInfoProps> = ({
  title,
  price,
  transactionType,
  type,
  surface,
  bedrooms,
  etage
}) => {
  const formatPrice = (price: string | number) => {
    // If it's a number, format it
    if (typeof price === 'number') {
      return `${price.toLocaleString('fr-FR')} DA`;
    }
    
    // If it's a string, check if it contains text (non-numeric characters except spaces, commas, and decimal points)
    // This preserves strings like "1 milliards", "600 million", "Sur demande", etc.
    const cleanedPrice = price.trim();
    const hasText = /[a-zA-Z\u0600-\u06FF]/.test(cleanedPrice); // Check for letters (including Arabic)
    
    if (hasText) {
      // It contains text, return as-is with DA
      return `${cleanedPrice} DA`;
    }
    
    // It's a pure number string, parse and format it
    const numericPrice = parseFloat(cleanedPrice.replace(/[,.\s]/g, ''));
    if (!isNaN(numericPrice) && isFinite(numericPrice)) {
      return `${numericPrice.toLocaleString('fr-FR')} DA`;
    }
    
    // Fallback for unparseable strings without text
    return `${cleanedPrice} DA`;
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'apartment': 'Appartement',
      'house': 'Maison',
      'villa': 'Villa',
      'land': 'Terrain'
    };
    return typeMap[type] || type;
  };

  const getTransactionLabel = (transactionType: string) => {
    return transactionType === 'vendre' ? 'À Vendre' : 'À Louer';
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      
      <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
        <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
          {formatPrice(price)}
        </span>
        <span className="bg-green-600 text-white px-4 py-2 rounded-full">
          {getTransactionLabel(transactionType)}
        </span>
        <span className="bg-gray-600 text-white px-4 py-2 rounded-full">
          {getTypeLabel(type)}
        </span>
        <span className="bg-gray-600 text-white px-4 py-2 rounded-full">
          {surface} m²
        </span>
        {bedrooms && (
          <span className="bg-gray-600 text-white px-4 py-2 rounded-full">
            {bedrooms} chambres
          </span>
        )}
        {typeof etage === 'number' && (
          <span className="bg-gray-600 text-white px-4 py-2 rounded-full">
            {etage === 0 ? 'rez-de-chaussée' : `${etage}ᵉ étage`}
          </span>
        )}
      </div>
    </div>
  );
};
