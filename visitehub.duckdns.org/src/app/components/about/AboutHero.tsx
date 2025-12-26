'use client';

import React from 'react';
import { useInViewOnce } from '@/app/hooks/useInViewOnce';

export const AboutHero = () => {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-white to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Animation: scroll-reveal (fade + slight upward motion) */}
        <div
          ref={ref}
          className={[
            'text-center transition-all duration-500 ease-out motion-reduce:transition-none',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            À propos –{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
              VisiteHub
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-6 text-gray-700 max-w-3xl mx-auto">
            Nous ne montrons pas vos espaces, nous les faisons vivre.
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            VisiteHub est une startup visionnaire née en Algérie avec une mission claire : révolutionner la manière dont les gens découvrent, visitent et choisissent leurs lieux.
            <br />
            Nous croyons qu'un espace ne doit pas seulement se montrer, mais se vivre.
          </p>
        </div>
      </div>
    </section>
  );
};
