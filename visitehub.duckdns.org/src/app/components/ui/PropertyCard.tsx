/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Property } from '../../../api';
import { formatPrice } from '../../../utils/formatPrice';
import { getTimeAgo, getRentPeriodLabel, isRecentlyAdded } from '../../../utils/dateUtils';
import { isSvgIcon, getSvgIconPath } from '@/app/utils/iconUtils';
import { resolveImageUrl } from '@/lib/resolveImageUrl';

// Nearby places are displayed on the card instead of amenities

interface PropertyCardProps {
  property: Property;
  className?: string;
  showVirtualTour?: boolean;
  href?: string; // Optional custom link (e.g., for agency-specific property pages)
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  className = '',
  showVirtualTour = true,
  href
}) => {
  const router = useRouter();

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

  // Use custom href if provided, otherwise default to /properties/{slug}
  const propertyPath = href || (property.slug ? `/properties/${property.slug}` : `/properties/${slugify(property.title)}-${property.id}`);

  // Generate SEO-friendly alt text and title
  const propertyTypeLabel = getPropertyTypeLabel(property.type);
  const location = `${property.daira || ''}${property.daira && property.wilaya ? ', ' : ''}${property.wilaya || ''}`.trim();
  const imageAltText = `${property.title} - ${propertyTypeLabel}${location ? ` - ${location}` : ''} - Image 1`;
  const imageTitle = `${property.title} - ${propertyTypeLabel}${location ? ` à ${location}` : ''} - ${getTransactionTypeLabel(property.transactionType)}`;

  const normalizeImagesInput = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    if (typeof value === 'string') {
      const str = value.trim();
      if (!str) return [];
      if (str.startsWith('[') && str.endsWith(']')) {
        try {
          const parsed = JSON.parse(str);
          return normalizeImagesInput(parsed);
        } catch {
          // fall through
        }
      }
      if (str.includes(',')) return str.split(',').map((s) => s.trim()).filter(Boolean);
      return [str];
    }
    return [];
  };

  const imagesList = normalizeImagesInput((property as any).images);
  const primaryImage = resolveImageUrl(imagesList.length > 0 ? imagesList[0] : undefined);
  const unoptimized = Boolean(primaryImage && primaryImage.startsWith('/uploads/'));

  const navigateToDetails = () => {
    router.push(propertyPath);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${className}`}
      role="link"
      tabIndex={0}
      onClick={navigateToDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToDetails();
        }
      }}
      aria-label={`Voir les détails: ${property.title}`}
    >
      {/* Property Image */}
      <div className="relative overflow-hidden h-64">
        <Image
          src={primaryImage || 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={imageAltText}
          title={imageTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={unoptimized}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${property.transactionType === 'vendre'
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
            onClick={(e) => e.stopPropagation()}
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
            onClick={(e) => e.stopPropagation()}
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCallClick();
            }}
            className="flex items-center justify-center bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Appeler"
          >
            <i className="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </div>
  );
}; 