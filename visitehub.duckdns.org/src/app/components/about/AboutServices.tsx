import React from 'react';

export const AboutServices = () => {
  return (
    <section className="py-16 sm:py-20 bg-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Notre Mission – Une solution née pour les vrais besoins
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Nous ne créons pas de simples visites virtuelles.
            Nous construisons un outil puissant qui aide :
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Agents immobiliers
            </h3>
            <p className="text-gray-600">
              À vendre plus vite et mieux
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Hôtels et agences de voyage
            </h3>
            <p className="text-gray-600">
              À séduire leurs clients avant même l'arrivée
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Industries et institutions
            </h3>
            <p className="text-gray-600">
              À moderniser leur communication
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Clients
            </h3>
            <p className="text-gray-600">
              À gagner confiance et temps
            </p>
          </div>
        </div>

      </div>

      {/* Nos Valeurs Section */}
      <div className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ce qui guide chacune de nos décisions et façonne notre vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white-50 p-6 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow text-center">
              <h4 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">
                Innovation
              </h4>
              <p className="text-gray-600">
                Toujours un pas en avance sur la technologie immersive.
              </p>
            </div>

            <div className="bg-white-50 p-6 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow text-center">
              <h4 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">
                Accessibilité
              </h4>
              <p className="text-gray-600">
                Rendre l'expérience 360° simple et abordable.
              </p>
            </div>

            <div className="bg-white-50 p-6 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow text-center">
              <h4 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">
                Impact
              </h4>
              <p className="text-white-600">
                Créer de la valeur réelle pour nos clients et leurs utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
