'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const PROPERTY_TYPES: Record<string, string> = {
  apartment: 'Appartement',
  villa: 'Villa',
  studio: 'Studio',
  house: 'Maison',
  land: 'Terrain',
  commercial: 'Commercial'
};

function ThankYouContent() {
  const searchParams = useSearchParams();

  // Get data from URL params
  const name = searchParams.get('name') || '';
  const propertyType = searchParams.get('propertyType') || '';
  const wilaya = searchParams.get('wilaya') || '';
  const intention = searchParams.get('intention') || 'sell';
  const want360 = searchParams.get('want360') === 'true';
  const sendMode = searchParams.get('sendMode') || 'email';

  const propertyTypeLabel = PROPERTY_TYPES[propertyType] || propertyType;
  const intentionLabel = intention === 'sell' ? 'Vendre' : 'Louer';

  // Track conversion event for Meta Pixel
  useEffect(() => {
    // Ensure fbq is available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      // Track Lead event for property request submission
      (window as any).fbq('track', 'Lead', {
        content_name: `Property Request - ${propertyTypeLabel}`,
        content_category: 'Real Estate',
        value: intention === 'sell' ? 'Sell Property' : 'Rent Property',
        currency: 'DZD',
        custom_data: {
          property_type: propertyType,
          location: wilaya,
          intention: intention,
          wants_360_tour: want360,
          contact_method: sendMode
        }
      });

      // Also track a custom conversion event
      (window as any).fbq('trackCustom', 'PropertyRequestSubmitted', {
        property_type: propertyType,
        location: wilaya,
        intention: intention,
        wants_360_tour: want360
      });
    }
  }, [propertyType, propertyTypeLabel, wilaya, intention, want360, sendMode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 rounded-full mb-6 animate-pulse">
            <i className="fas fa-check text-white text-4xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Merci {name ? `, ${name}` : ''} !
          </h1>
          <p className="text-xl text-gray-600">
            Votre demande a été envoyée avec succès
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          {/* Request Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-info-circle text-emerald-500 mr-3"></i>
              Détails de votre demande
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Type de bien</span>
                <span className="text-slate-800 font-semibold">{propertyTypeLabel}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Localisation</span>
                <span className="text-slate-800 font-semibold">{wilaya}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Intention</span>
                <span className="text-slate-800 font-semibold">{intentionLabel}</span>
              </div>
              {want360 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Visite virtuelle 360°</span>
                  <span className="text-emerald-600 font-semibold">
                    <i className="fas fa-check-circle mr-2"></i>
                    Demandée
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
                <span className="text-gray-600 font-medium">Mode de contact</span>
                <span className="text-slate-800 font-semibold">
                  {sendMode === 'whatsapp' ? (
                    <>
                      <i className="fab fa-whatsapp text-green-500 mr-2"></i>
                      WhatsApp
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope text-blue-500 mr-2"></i>
                      Email
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
              <i className="fas fa-clock text-emerald-600 mr-3"></i>
              Prochaines étapes
            </h2>
            <div className="space-y-3 text-emerald-800">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">
                  1
                </div>
                <p className="pt-1">
                  <strong>Dans les 24 heures :</strong> Notre équipe vous contactera via {sendMode === 'whatsapp' ? 'WhatsApp' : 'email'} pour confirmer votre demande.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">
                  2
                </div>
                <p className="pt-1">
                  <strong>Dans les 48 heures :</strong> Si vous avez demandé une visite virtuelle 360°, nous planifierons un rendez-vous pour le shooting.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">
                  3
                </div>
                <p className="pt-1">
                  <strong>Après le shooting :</strong> Votre bien sera mis en ligne sur 15+ plateformes immobilières avec votre visite virtuelle 360°.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Besoin d'aide ?
            </h3>
            <p className="text-gray-600 mb-4">
              Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <i className="fas fa-phone text-emerald-500 mr-3 w-5"></i>
                <a href="tel:+213561278961" className="hover:text-emerald-600">
                  +213 561 278 961
                </a>
              </div>
              <div className="flex items-center text-gray-700">
                <i className="fas fa-envelope text-emerald-500 mr-3 w-5"></i>
                <a href="mailto:contact@visitehub.com" className="hover:text-emerald-600">
                  contact@visitehub.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/properties"
            className="bg-white text-emerald-600 border-2 border-emerald-500 rounded-xl px-6 py-4 font-semibold text-center hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-home mr-2"></i>
            Voir nos propriétés
          </Link>
          <Link
            href="/vendre-louer"
            className="bg-emerald-500 text-white rounded-xl px-6 py-4 font-semibold text-center hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvelle demande
          </Link>
          <Link
            href="/"
            className="bg-white text-slate-700 border-2 border-slate-300 rounded-xl px-6 py-4 font-semibold text-center hover:bg-slate-50 transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-home mr-2"></i>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 rounded-full mb-6 animate-pulse">
              <i className="fas fa-check text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Chargement...
            </h1>
          </div>
        </div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}

