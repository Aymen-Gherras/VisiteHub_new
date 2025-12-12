'use client';

import React from 'react';

type PropertyHeroProps = {
  iframe360Link?: string;
};

export const PropertyHero: React.FC<PropertyHeroProps> = ({
  iframe360Link
}) => {
  // Normalize 360 link: accept raw URL or full <iframe> embed; ensure absolute https URL
  const normalizeTourUrl = (input?: string): string | null => {
    if (!input) return null;
    let urlCandidate = input.trim();
    // If full iframe markup, extract src
    if (urlCandidate.toLowerCase().includes('<iframe')) {
      const match = urlCandidate.match(/src=["']([^"']+)["']/i);
      urlCandidate = match ? match[1] : '';
    }
    if (!urlCandidate) return null;
    // If protocol-relative (//domain/path)
    if (urlCandidate.startsWith('//')) {
      urlCandidate = `https:${urlCandidate}`;
    }
    // If missing protocol, prefix https://
    if (!/^https?:\/\//i.test(urlCandidate)) {
      urlCandidate = `https://${urlCandidate}`;
    }
    return urlCandidate;
  };

  const tourUrl = normalizeTourUrl(iframe360Link);

  return (
    <div className="relative">
      {/* Hero Section with 360° Tour or Placeholder */}
      <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative overflow-hidden rounded-lg">
        {tourUrl ? (
          <iframe
            src={tourUrl}
            className="w-full h-full"
            allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking; vr"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <i className="fas fa-home text-6xl mb-4"></i>
              <p className="text-xl font-semibold">Visite Virtuelle 360°</p>
              <p className="text-sm opacity-90">Non disponible pour cette propriété</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
