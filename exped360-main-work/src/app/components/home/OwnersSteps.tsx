'use client';

import React from 'react';

export const OwnersSteps: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
            Pour les propriétaires
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            Vendez ou louez votre bien sans stress. Notre équipe s'occupe de tout.
          </p>
        </div>

        {/* Steps in one line */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 max-w-sm">
            <div className="text-center mb-4">
              <div className="text-blue-600 text-3xl mb-3">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800">Inscription rapide</h3>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-600 mb-2">Remplissez le formulaire en 3 minutes</p>
              <p className="text-slate-500 text-sm">Informations basiques, photos existantes, disponibilités</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <i className="fas fa-long-arrow-alt-right text-blue-600 text-3xl"></i>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 max-w-sm">
            <div className="text-center mb-4">
              <div className="text-blue-600 text-3xl mb-3">
                <i className="fas fa-camera"></i>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800">Shooting 360°</h3>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-600 mb-2">Notre équipe vient créer votre visite virtuelle</p>
              <p className="text-slate-500 text-sm">RDV en 48h, shooting 1h, équipement professionnel</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <i className="fas fa-long-arrow-alt-right text-blue-600 text-3xl"></i>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 max-w-sm">
            <div className="text-center mb-4">
              <div className="text-blue-600 text-3xl mb-3">
                <i className="fas fa-globe"></i>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800">Mise en ligne</h3>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-600 mb-2">Votre bien est visible sur 15+ plateformes</p>
              <p className="text-slate-500 text-sm">Diffusion automatique, statistiques détaillées, leads qualifiés</p>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-8">
          <a
            href="#contact-form"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Mettre mon bien en ligne
          </a>
        </div>
      </div>
    </section>
  );
};
