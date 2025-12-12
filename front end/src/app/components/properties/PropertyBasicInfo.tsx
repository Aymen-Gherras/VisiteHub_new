'use client';

import React from 'react';
import { getRentPeriodLabel, formatPropertyDate } from '../../../utils/dateUtils';

type PropertyBasicInfoProps = {
  title: string;
  price: string | number;
  transactionType: 'vendre' | 'location';
  type: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  surface: number;
  bedrooms?: number;
  etage?: number;
  rentPeriod?: 'month' | 'day';
  propertyOwnerType?: string;
  createdAt?: string;
};

export const PropertyBasicInfo: React.FC<PropertyBasicInfoProps> = ({
  title,
  price,
  transactionType,
  type,
  surface,
  bedrooms,
  etage,
  rentPeriod,
  propertyOwnerType,
  createdAt
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
    <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        
        {/* Creation date and rent period info */}
        <div className="flex flex-col sm:items-end gap-2 mt-2 sm:mt-0">
          {createdAt && (
            <div className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-calendar-alt mr-2"></i>
              <span>Publié le {formatPropertyDate(createdAt)}</span>
            </div>
          )}
          {transactionType === 'location' && rentPeriod && (
            <div className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-clock mr-2"></i>
              <span>Période: {rentPeriod === 'day' ? 'Par jour' : 'Par mois'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: compact 2-column grid */}
      <div className="sm:hidden mb-4">
        <div className="grid grid-cols-2 gap-2">
          {/* Prix */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <i className="fas fa-money-bill-wave text-blue-600"></i>
            <span className="text-sm font-semibold text-gray-800 truncate">{formatPrice(price)}</span>
          </div>

          {/* Transaction */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <i className="fas fa-tag text-green-600"></i>
            <span className="text-sm text-gray-800 truncate">{getTransactionLabel(transactionType)}</span>
          </div>

          {/* Type */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <i className="fas fa-bed text-gray-700"></i>
            <span className="text-sm text-gray-800 truncate">{getTypeLabel(type)}</span>
          </div>

          {/* Surface */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <i className="fas fa-ruler-combined text-gray-700"></i>
            <span className="text-sm text-gray-800 truncate">{surface} m²</span>
          </div>

          {/* Chambres */}
          {typeof bedrooms === 'number' && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <i className="fas fa-door-closed text-gray-700"></i>
              <span className="text-sm text-gray-800 truncate">{bedrooms} ch</span>
            </div>
          )}

          {/* Étage */}
          {typeof etage === 'number' && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <i className="fas fa-elevator text-gray-700"></i>
              <span className="text-sm text-gray-800 truncate">{etage === 0 ? 'rez-de-chaussée' : `${etage}ᵉ étage`}</span>
            </div>
          )}

          {/* Owner Type */}
          {propertyOwnerType && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <i className="fas fa-user-tie text-purple-600"></i>
              <span className="text-sm text-gray-800 truncate">{propertyOwnerType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Merged info bar with icons */}
      <div className="hidden sm:block rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:divide-x divide-y sm:divide-y-0 divide-gray-200">
          {/* Prix */}
          <div className="flex items-center gap-3 p-4 flex-1">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Prix</div>
              <div className="text-sm font-semibold text-gray-800 truncate">{formatPrice(price)}</div>
            </div>
          </div>

          {/* Transaction */}
          <div className="flex items-center gap-3 p-4 flex-1">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50 text-green-600">
              <i className="fas fa-tag"></i>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Transaction</div>
              <div className="text-sm font-semibold text-gray-800 truncate">{getTransactionLabel(transactionType)}</div>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center gap-3 p-4 flex-1">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-700">
              <i className="fas fa-bed"></i>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Type de Propriété</div>
              <div className="text-sm font-semibold text-gray-800 truncate">{getTypeLabel(type)}</div>
            </div>
          </div>

          {/* Surface */}
          <div className="flex items-center gap-3 p-4 flex-1">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-700">
              <i className="fas fa-ruler-combined"></i>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Surface</div>
              <div className="text-sm font-semibold text-gray-800 truncate">{surface} m²</div>
            </div>
          </div>

          {/* Chambres */}
          {typeof bedrooms === 'number' && (
            <div className="flex items-center gap-3 p-4 flex-1">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-700">
                <i className="fas fa-door-closed"></i>
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Chambres</div>
                <div className="text-sm font-semibold text-gray-800 truncate">{bedrooms}</div>
              </div>
            </div>
          )}

          {/* Étage */}
          {typeof etage === 'number' && (
            <div className="flex items-center gap-3 p-4 flex-1">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-700">
                <i className="fas fa-elevator"></i>
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Étage</div>
                <div className="text-sm font-semibold text-gray-800 truncate">{etage === 0 ? 'rez-de-chaussée' : `${etage}`}</div>
              </div>
            </div>
          )}

          {/* Owner Type */}
          {propertyOwnerType && (
            <div className="flex items-center gap-3 p-4 flex-1">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Propriétaire</div>
                <div className="text-sm font-semibold text-gray-800 truncate">{propertyOwnerType}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

