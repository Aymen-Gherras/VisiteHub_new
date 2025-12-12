'use client';

import React from 'react';
import { NearbyPlace } from '@/api';
import { isSvgIcon, getSvgIconPath } from '@/app/utils/iconUtils';

interface NearbyPlacesListProps {
  places?: NearbyPlace[];
}

export const NearbyPlacesList: React.FC<NearbyPlacesListProps> = ({ places = [] }) => {
  if (!places || places.length === 0) {
    return null;
  }

  // Sort by displayOrder, then by creation date
  const sortedPlaces = [...places].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Lieux à proximité</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {sortedPlaces.map((place) => {
          const icon = place.icon || '📍';
          const displayText = `${place.name} (${place.distance})`;
          const isSvg = isSvgIcon(icon);
          
          return (
            <div
              key={place.id}
              className="inline-flex items-center gap-2 sm:gap-3 px-2.5 py-2 sm:px-3 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm transition-all w-auto max-w-full"
            >
              <div className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md sm:rounded-lg bg-blue-50 ${isSvg ? 'p-1' : ''} shrink-0`}>
                {isSvg && getSvgIconPath(icon) ? (
                  <img 
                    src={getSvgIconPath(icon)} 
                    alt={place.name}
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
                  <span className="text-blue-600 text-sm sm:text-base">{icon}</span>
                )}
              </div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm truncate" title={displayText}>
                {displayText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

