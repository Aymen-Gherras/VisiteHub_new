'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type PropertyGalleryProps = {
  images: string[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
};

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  images,
  selectedIndex,
  onImageSelect,
}) => {
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);

  const openZoomModal = (index: number) => {
    setZoomedImageIndex(index);
    setShowZoomModal(true);
  };

  const closeZoomModal = () => {
    setShowZoomModal(false);
  };

  const nextImage = () => {
    setZoomedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setZoomedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Main Image */}
      <div className="relative aspect-video cursor-pointer" onClick={() => openZoomModal(selectedIndex)}>
        {images && images.length > 0 ? (
          <Image
            src={images[selectedIndex]}
            alt={`Property image ${selectedIndex + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          <i className="fas fa-search-plus mr-1"></i>
          Zoom
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images && images.length > 1 && (
        <div className="p-2 sm:p-4 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-blue-600'
                  : 'border-transparent hover:border-blue-400'
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover cursor-pointer"
                sizes="80px"
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
            {images.length > 1 && (
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
              {zoomedImageIndex + 1} / {images.length}
            </div>

            {/* Main zoomed image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[zoomedImageIndex]}
                alt={`Property image ${zoomedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};