import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '../../../api';
import { formatPrice } from '../../../utils/formatPrice';
import { getTimeAgo, getRentPeriodLabel, isRecentlyAdded } from '../../../utils/dateUtils';

// Nearby places are displayed on the card instead of amenities

interface PropertyCardProps {
  property: Property;
  className?: string;
  showVirtualTour?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  className = '',
  showVirtualTour = true 
}) => {
  const handleCallClick = () => {
    window.location.href = 'tel:+213556267621';
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: 'Appartement',
      villa: 'Villa',
      studio: 'Studio',
      house: 'Maison',
      land: 'Terrain',
      commercial: 'Commercial'
    };
    return types[type] || type;
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'vendre' ? 'Vente' : 'Location';
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const propertyPath = property.slug ? `/properties/${property.slug}` : `/properties/${slugify(property.title)}-${property.id}`;

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
      {/* Property Image */}
      <div className="relative overflow-hidden h-64">
        <Image
          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            property.transactionType === 'vendre' 
              ? 'bg-slate-700 text-white' 
              : 'bg-orange-500 text-white'
          }`}>
            {getTransactionTypeLabel(property.transactionType)}
          </span>
          {/* Recently added badge */}
          {property.createdAt && isRecentlyAdded(property.createdAt) && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
              Nouveau
            </span>
          )}
        </div>
        
        {property.iframe360Link && showVirtualTour && (
          <Link
            href={propertyPath}
            className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Visite 360°
          </Link>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Link 
            href={propertyPath}
            className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1"
          >
            {property.title}
          </Link>

        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <i className="fas fa-map-marker-alt mr-1 text-emerald-500"></i>
          <span className="text-sm">{property.daira}, {property.wilaya}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <i className="fas fa-ruler-combined mr-1 text-emerald-500"></i>
            {property.surface}m²
          </div>
          <div className="flex items-center">
            <span className="font-medium">{getPropertyTypeLabel(property.type)}</span>
          </div>
        </div>

        {/* Nearby Places Preview (clamped to 2 lines) */}
        <div className="mb-4">
          {property.nearbyPlaces && property.nearbyPlaces.length > 0 ? (
            <div className="relative flex flex-wrap gap-2 max-h-14 overflow-hidden">
              {property.nearbyPlaces
                .slice()
                .sort((a: any, b: any) => {
                  if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
                  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                  return aTime - bTime;
                })
                .slice(0, 8)
                .map((place: any) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs max-w-[160px] truncate"
                    title={place.name}
                  >
                    <span>{place.icon || '📍'}</span>
                    <span className="text-gray-700 truncate">{place.name}</span>
                  </div>
                ))}
              {property.nearbyPlaces.length > 8 && (
                <div className="absolute bottom-0 right-0 bg-slate-700 text-white px-2 py-0.5 rounded-full text-[10px]">
                  +{property.nearbyPlaces.length - 8}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-500">Aucun lieu à proximité</div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-emerald-600">
              {formatPrice(property.price)}
            </span>
            {property.transactionType === 'location' && (
              <span className="text-gray-500 ml-1">
                {getRentPeriodLabel(property.rentPeriod)}
              </span>
            )}
          </div>
        </div>

        {/* Time ago display */}
        {property.createdAt && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <i className="fas fa-clock mr-1"></i>
            <span>{getTimeAgo(property.createdAt)}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={propertyPath}
            className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-center text-sm font-medium"
          >
            Voir détails
          </Link>
          <button
            onClick={handleCallClick}
            className="flex items-center justify-center bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-700
            . transition-colors"
          >
            <i className="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </div>
  );
}; 