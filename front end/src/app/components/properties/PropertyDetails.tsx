'use client';

import React, { useState } from 'react';
import { NearbyPlace } from '@/api';

type Property = {
  id: string;
  title: string;
  description: string;
  price: string | number;
  address: string;
  city: string;
  bedrooms: number;
  etage?: number;
  bathrooms?: number;
  surface: number;
  type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
  features?: string[];
  nearbyPlaces?: NearbyPlace[];
  papers?: string[];
  serviceTier: 'basic' | 'premium_360';
  has360Tour: boolean;
};

type PropertyDetailsProps = {
  property: Property;
};

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const [showAll, setShowAll] = useState(false);

  // Nearby places for Caractéristiques section
  const nearbyPlaces = property.nearbyPlaces || [];
  const papers = property.papers || [];
  
  // Sort nearby places by displayOrder
  const sortedNearbyPlaces = [...nearbyPlaces].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Create display items from nearby places
  const nearbyPlaceItems = sortedNearbyPlaces.map(place => ({
    text: `${place.name} (${place.distance})`,
    icon: place.icon || '📍',
  }));
  
  const maxVisible = 10;
  const visibleNearbyPlaces = showAll ? nearbyPlaceItems : nearbyPlaceItems.slice(0, maxVisible);
  const hasMoreNearbyPlaces = nearbyPlaceItems.length > maxVisible;

  // Helpers
  const typeLabelMap: Record<Property['type'], string> = {
    apartment: 'Appartement',
    house: 'Maison',
    villa: 'Villa',
    commercial: 'Commercial',
    land: 'Terrain',
  };

  const formatPrice = (value: number | string | undefined) => {
    if (value === undefined || value === null) return '—';
    
    // If it's a number, format it
    if (typeof value === 'number') {
      try {
        return `${value.toLocaleString('fr-FR')} DA`;
      } catch {
        return `${value} DA`;
      }
    }
    
    // If it's a string, check if it's a pure number (can be parsed)
    const numericPrice = parseFloat(value.replace(/[,\s]/g, ''));
    if (!isNaN(numericPrice) && isFinite(numericPrice)) {
      // It's a valid number, format it
      try {
        return `${numericPrice.toLocaleString('fr-FR')} DA`;
      } catch {
        return `${numericPrice} DA`;
      }
    }
    
    // It's text (like "1 milliards" or "Sur demande"), return as-is with DA
    return `${value} DA`;
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">

      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Description</h2>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words">{property.description}</p>
      </div>

      {nearbyPlaceItems.length > 0 && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Caractéristiques</h2>
          <div id="features-list" className="flex flex-wrap gap-2 sm:gap-3">
            {visibleNearbyPlaces.map((item, index) => {
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 sm:gap-3 px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm transition-all w-auto max-w-full"
                >
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md sm:rounded-lg bg-blue-50 text-blue-600 text-sm sm:text-base shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm truncate" title={item.text}>{item.text}</span>
                </div>
              );
            })}
          </div>

          {hasMoreNearbyPlaces && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                aria-controls="features-list"
                className="px-3 py-2 sm:px-4 rounded-lg text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                {showAll ? "Voir moins" : `Voir plus (${nearbyPlaceItems.length - maxVisible} autres)`}
              </button>
            </div>
          )}
        </div>
      )}

      {Array.isArray(papers) && papers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Papiers</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {papers.map((paper, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 sm:gap-3 px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 rounded-lg border border-gray-200 w-auto max-w-full">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-green-50 text-green-600 shrink-0">📄</div>
                <span className="text-gray-700 text-xs sm:text-sm font-medium truncate" title={paper}>{paper}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};