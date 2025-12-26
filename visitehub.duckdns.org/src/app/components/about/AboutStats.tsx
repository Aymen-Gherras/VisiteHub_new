'use client';

import React from 'react';
import { useInViewOnce } from '@/app/hooks/useInViewOnce';

const featureCards = [
  {
    icon: 'fas fa-vr-cardboard',
    title: 'Immersion totale',
    description: 'Pas une simple galerie photo',
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Expérience fluide',
    description: 'Sur mobile & desktop',
  },
  {
    icon: 'fas fa-globe',
    title: 'Visibilité renforcée',
    description: 'Sur le web et les réseaux sociaux',
  },
  {
    icon: 'fas fa-cogs',
    title: 'Technologie évolutive',
    description: 'Pensée pour évoluer avec vos besoins',
  },
];

export const AboutStats = () => {
  const { ref: headerRef, isInView: headerInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });
  const { ref: gridRef, isInView: gridInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });
  const { ref: ambitionRef, isInView: ambitionInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animation: scroll-reveal (section title) */}
        <div
          ref={headerRef}
          className={[
            'text-center mb-12 sm:mb-16 transition-all duration-500 ease-out motion-reduce:transition-none',
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Pourquoi <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">VisiteHub</span> ?
          </h2>
        </div>

        {/* Animation: scroll-reveal (feature cards) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {featureCards.map((card, index) => (
            <div
              key={card.title}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={[
                'group text-center transition-all duration-300 ease-out motion-reduce:transition-none',
                gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              ].join(' ')}
            >
              <div className="bg-emerald-100/80 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none">
                <i className={`${card.icon} text-2xl text-emerald-600`}></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Ambition Section */}
        {/* Animation: scroll-reveal (CTA/ambition banner) */}
        <div
          ref={ambitionRef}
          className={[
            'bg-gradient-to-r from-emerald-600 to-lime-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-sm',
            'transition-all duration-500 ease-out motion-reduce:transition-none',
            ambitionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
             Notre Ambition – Révolutionner le marché
          </h3>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
            VisiteHub n'est pas une tendance. C'est une révolution.
            Nous voulons transformer la manière dont les espaces sont perçus et consommés.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Demain, les visites classiques sembleront obsolètes.
            Aujourd'hui, nous écrivons cette nouvelle norme.
          </p>
        </div>
      </div>
    </section>
  );
};