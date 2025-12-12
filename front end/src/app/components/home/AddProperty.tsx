'use client';

import React from 'react';
import PropertyRequestForm from '../../components/contact/PropertyRequestForm';
import { OwnersSteps } from './OwnersSteps';

const AddProperty = () => {

  const wilayas = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif',
    'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'El Oued', 'Skikda', 'Tiaret', 'Béjaïa'
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'house', label: 'Maison' },
    { value: 'land', label: 'Terrain' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const benefits = [
    "Visite virtuelle 360° professionnelle incluse",
    "Diffusion sur 15+ plateformes immobilières",
    "Photos HDR et visite virtuelle en 48h",
    "Gestion complète des visites et contacts",
    "Contrat digital sécurisé",
    "Commission transparente (3% seulement)"
  ];

  const beforeAfter = [
    {
      before: "20+ visites physiques nécessaires",
      after: "3-5 visites physiques qualifiées seulement"
    },
    {
      before: "Disponibilité 7j/7 pour les visites",
      after: "Visites virtuelles 24h/24"
    },
    {
      before: "Photos smartphone peu attractives",
      after: "Visite 360° immersive professionnelle"
    },
    {
      before: "Négociations compliquées",
      after: "Plateforme digitale simplifiée"
    }
  ];

  // Form moved to PropertyRequestForm

  return (
    <section id="vendre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Vendez ou louez sans effort avec
            <span className="text-emerald-500"> VisiteHub</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Vous êtes fatigué de faire visiter votre bien 20 fois ? 
            Laissez VisiteHub le faire pour vous. Notre technologie 360° 
            attire uniquement des visiteurs qualifiés.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-emerald-800 font-medium">
              ⚡ Offre de lancement : Première visite virtuelle à 50% de réduction
            </p>
          </div>
        </div>

        {/* Contact Form - Moved here to appear directly after hero section */}
        <div id="contact-form" className="mb-16">
          <PropertyRequestForm />
        </div>

        {/* Before/After Comparison */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            VisiteHub résout vos problèmes
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h4 className="text-xl font-bold text-red-800 mb-6 text-center">
                ❌ Sans VisiteHub
              </h4>
              <div className="space-y-4">
                {beforeAfter.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-red-800">{item.before}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8">
              <h4 className="text-xl font-bold text-emerald-800 mb-6 text-center">
                ✅ Avec VisiteHub
              </h4>
              <div className="space-y-4">
                {beforeAfter.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <i className="fas fa-check-circle text-emerald-500 mr-3 mt-1"></i>
                    <p className="text-emerald-800">{item.after}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Ce qui est inclus dans notre service
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-emerald-500 mr-3 mt-1"></i>
                  <p className="text-slate-700 font-medium">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Calculator */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-16 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Calculez le coût de votre visite virtuelle
              </h3>
              <p className="text-gray-300 mb-6">
                Prix transparent, pas de frais cachés. 
                Paiement seulement après validation de votre visite 360°.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span>Visite virtuelle 360°</span>
                  <span className="font-bold">8 000 DA</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span>Photos HDR professionnelles</span>
                  <span className="font-bold">Incluses</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span>Diffusion multi-plateformes</span>
                  <span className="font-bold">Incluse</span>
                </div>
                <div className="flex justify-between items-center py-3 text-xl font-bold text-emerald-400">
                  <span>Total</span>
                  <span>8 000 DA</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <i className="fas fa-calculator text-4xl text-emerald-400"></i>
              </div>
              <p className="text-center text-lg font-medium mb-4">
                Offre de lancement
              </p>
              <div className="text-center">
                <span className="text-3xl font-bold line-through text-gray-400">8 000 DA</span>
                <span className="text-4xl font-bold text-emerald-400 ml-4">4 000 DA</span>
              </div>
              <p className="text-center text-sm text-gray-300 mt-2">
                Économisez 50% sur votre première visite virtuelle
              </p>
            </div>
          </div>
        </div>

        {/* Owners Steps */}
        <OwnersSteps />
      </div>
    </section>
  );
};

export { AddProperty }; 