import React from 'react';

export const AboutStats = () => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
             Pourquoi VisiteHub ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="text-center">
            <div className="bg-emerald-100/80 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="fas fa-vr-cardboard text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Immersion totale
            </h3>
            <p className="text-gray-600">
              Pas une simple galerie photo
            </p>
          </div>

          <div className="text-center">
            <div className="bg-emerald-100/80 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="fas fa-mobile-alt text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Expérience fluide
            </h3>
            <p className="text-gray-600">
              Sur mobile & desktop
            </p>
          </div>

          <div className="text-center">
            <div className="bg-emerald-100/80 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="fas fa-globe text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Visibilité renforcée
            </h3>
            <p className="text-gray-600">
              Sur le web et les réseaux sociaux
            </p>
          </div>

          <div className="text-center">
            <div className="bg-emerald-100/80 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <i className="fas fa-cogs text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Technologie évolutive
            </h3>
            <p className="text-gray-600">
              Pensée pour évoluer avec vos besoins
            </p>
          </div>
        </div>

        {/* Ambition Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-lime-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-sm">
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