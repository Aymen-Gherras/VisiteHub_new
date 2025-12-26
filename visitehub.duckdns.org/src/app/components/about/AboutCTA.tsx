'use client';

import React from 'react';
import Link from 'next/link';
import { useInViewOnce } from '@/app/hooks/useInViewOnce';

export const AboutCTA = () => {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animation: scroll-reveal + button hover transitions */}
        <div
          ref={ref}
          className={[
            'text-center transition-all duration-500 ease-out motion-reduce:transition-none',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
            Rejoignez La <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">révolution</span> immersive
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Et si vous étiez parmi les premiers à rejoindre la révolution immersive en Algérie ?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-emerald-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-sm transition-all duration-300 ease-out hover:bg-emerald-700 hover:shadow-md motion-reduce:transition-none"
            >
              <i className="fas fa-play mr-2"></i>
              Demander une démo gratuite
            </Link>
            
            <Link
              href="/vendre-louer"
              className="inline-flex items-center border-2 border-emerald-600 text-emerald-700 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ease-out hover:bg-emerald-700 hover:text-white hover:shadow-sm motion-reduce:transition-none"
            >
              <i className="fas fa-home mr-2"></i>
              Mettre mon bien en ligne
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};