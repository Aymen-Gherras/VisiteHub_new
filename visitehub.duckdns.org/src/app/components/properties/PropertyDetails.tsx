'use client';

import React, { useState } from 'react';
import { NearbyPlace } from '@/api';
import { isSvgIcon, getSvgIconPath } from '@/app/utils/iconUtils';

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
        return value.toLocaleString('fr-FR');
      } catch {
        return String(value);
      }
    }
    
    // If it's a string, return it as-is (user can include "DA" manually if needed)
    return value.trim();
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
              const isSvg = isSvgIcon(item.icon);
              const iconPath = isSvg ? getSvgIconPath(item.icon) : '';
              
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 sm:gap-3 px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm transition-all w-auto max-w-full"
                >
                  <div className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md sm:rounded-lg bg-blue-50 ${isSvg ? 'p-1' : ''} shrink-0`}>
                    {isSvg && iconPath ? (
                      <img 
                        src={iconPath} 
                        alt={item.text}
                        className="w-full h-full object-contain"
                        style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(1352%) hue-rotate(142deg) brightness(94%) contrast(87%)' }}
                        onError={(e) => {
                          // Hide broken image and show emoji fallback
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-blue-600 text-sm sm:text-base">📍</span>';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-blue-600 text-sm sm:text-base">{item.icon}</span>
                    )}
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