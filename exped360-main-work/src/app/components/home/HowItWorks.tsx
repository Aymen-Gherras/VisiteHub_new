'use client';

import React from 'react';

const HowItWorks = () => {
  const stepsForBuyers = [
    {
      icon: <i className="fas fa-globe text-4xl"></i>,
      title: "Explorez en 360°",
      description: "Visitez tous les biens qui vous intéressent depuis chez vous",
      detail: "Navigation immersive, mesures précises, visite libre 24h/24"
    },
    {
      icon: <i className="fas fa-user-check text-4xl"></i>,
      title: "Sélectionnez vos favoris",
      description: "Créez votre shortlist et comparez facilement",
      detail: "Sauvegarde automatique, notes personnelles, partage en famille"
    },
    {
      icon: <i className="fas fa-key text-4xl"></i>,
      title: "Visitez physiquement",
      description: "Une seule visite physique pour le bien de vos rêves",
      detail: "RDV confirmé, dossier préparé, négociation facilitée"
    }
  ];

  const stepsForSellers = [
    {
      icon: <i className="fas fa-user-check text-4xl"></i>,
      title: "Inscription rapide",
      description: "Remplissez le formulaire en 3 minutes",
      detail: "Informations basiques, photos existantes, disponibilités"
    },
    {
      icon: <i className="fas fa-camera text-4xl"></i>,
      title: "Shooting 360°",
      description: "Notre équipe vient créer votre visite virtuelle",
      detail: "RDV en 48h, shooting 1h, équipement professionnel"
    },
    {
      icon: <i className="fas fa-globe text-4xl"></i>,
      title: "Mise en ligne",
      description: "Votre bien est visible sur 15+ plateformes",
      detail: "Diffusion automatique, statistiques détaillées, leads qualifiés"
    }
  ];

  const stats = [
    { number: "87%", label: "de visites virtuelles en moins", color: "text-emerald-500" },
    { number: "3x", label: "plus rapide à vendre", color: "text-blue-500" },
    { number: "92%", label: "de satisfaction client", color: "text-purple-500" },
    { number: "48h", label: "mise en ligne garantie", color: "text-orange-500" }
  ];

  return (
    <section id="comment" className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            L'immobilier aussi simple que commander en ligne. 
            Découvrez comment VisiteHub révolutionne l'achat et la vente de biens.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Process for Buyers */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-4">
            Pour les acheteurs & locataires
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Fini les visites inutiles. Trouvez votre bien idéal en 3 étapes simples.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stepsForBuyers.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-emerald-500 mb-4">
                    {step.icon}
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <h4 className="text-xl font-bold text-slate-800">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.detail}
                  </p>
                </div>
                
                {index < stepsForBuyers.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <i className="fas fa-arrow-right text-2xl text-emerald-300"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-emerald-500 text-white px-8 py-4 rounded-xl hover:bg-emerald-600 transition-colors font-bold text-lg">
              Commencer ma recherche
            </button>
          </div>
        </div>

        {/* Process for Sellers */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-4">
            Pour les propriétaires
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Vendez ou louez votre bien sans stress. Notre équipe s'occupe de tout.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stepsForSellers.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-blue-500 mb-4">
                    {step.icon}
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <h4 className="text-xl font-bold text-slate-800">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.detail}
                  </p>
                </div>
                
                {index < stepsForSellers.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <i className="fas fa-arrow-right text-2xl text-blue-300"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors font-bold text-lg">
              Mettre mon bien en ligne
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-slate-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Découvrez la magie de la visite virtuelle
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Regardez comment notre technologie 360° transforme 
            l'expérience immobilière en Algérie.
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-slate-700 rounded-xl aspect-video flex items-center justify-center group cursor-pointer hover:bg-slate-600 transition-colors">
              <div className="bg-emerald-500 rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-play text-white text-xl ml-1"></i>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold mb-2">Démo VisiteHub</p>
                <p className="text-gray-300">3 min · Visite complète d'une villa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks }; 