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
      return price.toLocaleString('fr-FR');
    }
    
    // If it's a string, return it as-is (user can include "DA" manually if needed)
    return price.trim();
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
