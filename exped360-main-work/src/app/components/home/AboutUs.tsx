'use client';

import React from 'react';

const AboutUs = () => {
  const team = [
    {
      name: "Yacine F.",
      role: "Fondateur & CEO",
      description: "Expert en immobilier et technologie 360°",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Sarah M.",
      role: "Directrice Commerciale",
      description: "Spécialiste en relation client et vente",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Mohammed K.",
      role: "Directeur Technique",
      description: "Expert en développement et technologie 360°",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    }
  ];

  const values = [
    {
      icon: <i className="fas fa-eye text-3xl"></i>,
      title: "Transparence",
      description: "Prix clairs, processus transparent, aucune surprise"
    },
    {
      icon: <i className="fas fa-rocket text-3xl"></i>,
      title: "Innovation",
      description: "Technologie de pointe pour révolutionner l'immobilier"
    },
    {
      icon: <i className="fas fa-heart text-3xl"></i>,
      title: "Satisfaction",
      description: "La satisfaction client est notre priorité absolue"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            À propos de VisiteHub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous révolutionnons l'immobilier algérien avec la technologie 360°. 
            Notre mission : simplifier l'achat et la vente de biens immobiliers.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-emerald-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Notre Mission
            </h3>
            <p className="text-gray-600 mb-6">
              Rendre l'immobilier accessible à tous en Algérie grâce à la technologie 360°. 
              Nous voulons éliminer les visites inutiles et permettre aux acheteurs de 
              découvrir leur futur bien depuis chez eux.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <i className="fas fa-check text-emerald-500 mr-2"></i>
                Réduire les visites physiques de 80%
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-emerald-500 mr-2"></i>
                Accélérer les ventes de 3x
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-emerald-500 mr-2"></i>
                Améliorer l'expérience client
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Notre Vision
            </h3>
            <p className="text-gray-600 mb-6">
              Devenir la référence de l'immobilier digital en Algérie et en Afrique du Nord. 
              Nous imaginons un marché immobilier où la technologie facilite chaque transaction.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <i className="fas fa-check text-blue-500 mr-2"></i>
                Leader du marché 360° en Algérie
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-blue-500 mr-2"></i>
                Expansion dans 5 pays d'ici 2025
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-blue-500 mr-2"></i>
                Technologie accessible à tous
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Nos Valeurs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-emerald-500 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Notre Équipe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h4 className="text-xl font-bold text-slate-800 mb-1">
                  {member.name}
                </h4>
                <p className="text-emerald-500 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Prêt à révolutionner votre expérience immobilière ?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Rejoignez les centaines de clients satisfaits de VisiteHub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Commencer ma recherche
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-emerald-600 transition-colors">
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { AboutUs };