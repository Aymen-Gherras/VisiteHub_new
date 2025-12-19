'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/resolveImageUrl';

type PropertyGalleryProps = {
  images: unknown;
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  propertyTitle?: string;
  propertyType?: string;
  propertyLocation?: string;
  transactionType?: string;
};

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  images,
  selectedIndex,
  onImageSelect,
  propertyTitle = 'Property',
  propertyType = '',
  propertyLocation = '',
  transactionType = '',
}) => {
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);

  const normalizeImagesInput = (value: unknown): string[] => {
    if (!value) return [];

    // Already an array.
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            const maybeUrl = (item as any).url || (item as any).path || (item as any).src;
            return typeof maybeUrl === 'string' ? maybeUrl : undefined;
          }
          return undefined;
        })
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
    }

    // Some backends serialize arrays as JSON strings.
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

      // Comma-separated fallback.
      if (str.includes(',')) {
        return str
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Single string.
      return [str];
    }

    return [];
  };

  const normalizedImages = normalizeImagesInput(images)
    .map((img) => resolveImageUrl(img))
    .filter((img): img is string => Boolean(img));

  const safeSelectedIndex = normalizedImages.length > 0
    ? Math.min(Math.max(selectedIndex, 0), normalizedImages.length - 1)
    : 0;

  // Generate SEO-friendly alt text and title for images
  const getImageAltText = (imageIndex: number) => {
    const parts = [propertyTitle];
    if (propertyType) parts.push(propertyType);
    if (propertyLocation) parts.push(propertyLocation);
    parts.push(`Image ${imageIndex + 1}`);
    return parts.join(' - ');
  };

  const getImageTitle = (imageIndex: number) => {
    const parts = [propertyTitle];
    if (propertyType) parts.push(propertyType);
    if (propertyLocation) parts.push(`à ${propertyLocation}`);
    if (transactionType) {
      const transactionLabel = transactionType === 'vendre' ? 'Vente' : 'Location';
      parts.push(transactionLabel);
    }
    parts.push(`Photo ${imageIndex + 1}`);
    return parts.join(' - ');
  };

  const openZoomModal = (index: number) => {
    setZoomedImageIndex(index);
    setShowZoomModal(true);
  };

  const closeZoomModal = () => {
    setShowZoomModal(false);
  };

  const nextImage = () => {
    setZoomedImageIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const prevImage = () => {
    setZoomedImageIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Main Image */}
      <div className="relative aspect-video cursor-pointer" onClick={() => openZoomModal(safeSelectedIndex)}>
        {normalizedImages.length > 0 ? (
          <Image
            src={normalizedImages[safeSelectedIndex]}
            alt={getImageAltText(safeSelectedIndex)}
            title={getImageTitle(safeSelectedIndex)}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
            unoptimized={normalizedImages[safeSelectedIndex].startsWith('/uploads/')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {/* Zoom indicator - iOS compatible */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-10 pointer-events-none touch-action-none">
          <i className="fas fa-search-plus mr-1"></i>
          Zoom
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {normalizedImages.length > 1 && (
        <div className="p-2 sm:p-4 flex gap-2 overflow-x-auto">
          {normalizedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === safeSelectedIndex
                  ? 'border-blue-600'
                  : 'border-transparent hover:border-blue-400'
              }`}
            >
              <Image
                src={image}
                alt={getImageAltText(index)}
                title={getImageTitle(index)}
                fill
                className="object-cover cursor-pointer"
                sizes="80px"
                unoptimized={image.startsWith('/uploads/')}
              />
              {/* Click to zoom indicator */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                <i className="fas fa-search-plus text-white opacity-0 hover:opacity-100 transition-opacity"></i>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeZoomModal}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            {/* Navigation arrows */}
            {normalizedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <i className="fas fa-chevron-left text-xl"></i>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <i className="fas fa-chevron-right text-xl"></i>
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded text-sm">
              {zoomedImageIndex + 1} / {normalizedImages.length}
            </div>

            {/* Main zoomed image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={normalizedImages[zoomedImageIndex]}
                alt={getImageAltText(zoomedImageIndex)}
                title={getImageTitle(zoomedImageIndex)}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized={normalizedImages[zoomedImageIndex].startsWith('/uploads/')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};