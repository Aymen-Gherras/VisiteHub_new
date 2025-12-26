'use client';

import React from 'react';
import { useInViewOnce } from '@/app/hooks/useInViewOnce';

const missionCards = [
  { title: 'Agents immobiliers', description: 'À vendre plus vite et mieux' },
  { title: 'Hôtels et agences de voyage', description: "À séduire leurs clients avant même l'arrivée" },
  { title: 'Industries et institutions', description: 'À moderniser leur communication' },
  { title: 'Clients', description: 'À gagner confiance et temps' },
];

const valueCards = [
  { title: 'Innovation', description: 'Toujours un pas en avance sur la technologie immersive.' },
  { title: 'Accessibilité', description: "Rendre l'expérience 360° simple et abordable." },
  { title: 'Impact', description: 'Créer de la valeur réelle pour nos clients et leurs utilisateurs.' },
];

export const AboutServices = () => {
  const { ref: missionRef, isInView: missionInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });
  const { ref: valuesRef, isInView: valuesInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission Section */}
        {/* Animation: scroll-reveal (section intro) */}
        <div
          ref={missionRef}
          className={[
            'text-center mb-12 sm:mb-16 transition-all duration-500 ease-out motion-reduce:transition-none',
            missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Notre <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">Mission</span> – Une solution née pour les vrais besoins
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Nous ne créons pas de simples visites virtuelles.
            Nous construisons un outil puissant qui aide :
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {missionCards.map((card, index) => (
            <div
              key={card.title}
              style={{ transitionDelay: `${index * 80}ms` }}
              className={[
                // Hover: subtle lift + border/Shadow enhancement using existing palette
                'bg-gradient-to-br from-emerald-50 to-lime-50 p-6 rounded-xl border border-emerald-100 shadow-sm text-center',
                'transition-all duration-300 ease-out motion-reduce:transition-none',
                'hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200/70 hover:from-emerald-100 hover:to-lime-100',
                'will-change-transform will-change-opacity',
                // Animation: scroll-reveal (cards)
                missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              ].join(' ')}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-3">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Nos Valeurs Section */}
      <div className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animation: scroll-reveal (section intro) */}
          <div
            ref={valuesRef}
            className={[
              'text-center mb-12 sm:mb-16 transition-all duration-500 ease-out motion-reduce:transition-none',
              valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
            ].join(' ')}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nos <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">Valeurs</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ce qui guide chacune de nos décisions et façonne notre vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {valueCards.map((card, index) => (
              <div
                key={card.title}
                style={{ transitionDelay: `${index * 90}ms` }}
                className={[
                  'bg-gradient-to-br from-emerald-50 to-lime-50 p-6 rounded-xl border border-emerald-100 shadow-sm text-center',
                  'transition-all duration-300 ease-out motion-reduce:transition-none',
                  'hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200/70 hover:from-emerald-100 hover:to-lime-100',
                  'will-change-transform will-change-opacity',
                  valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                ].join(' ')}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">
                  {card.title}
                </h4>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
