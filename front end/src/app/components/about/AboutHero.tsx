import React from 'react';

export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-white to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          <span className="inline-block text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full mb-4">
            À propos
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            À propos – VisiteHub
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
