import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ServiceTier {
  id: 'basic' | 'premium';
  name: string;
  description: string;
  price: string;
  icon: string;
  color: string;
  features: string[];
  recommended?: boolean;
}

const serviceTiers: ServiceTier[] = [
  {
    id: 'basic',
    name: 'Formule Basique',
    description: 'Vente traditionnelle avec accompagnement',
    price: 'Commission uniquement',
    icon: 'fas fa-home',
    color: 'green',
    features: [
      'Photos professionnelles standard',
      'Gestion complète des visites',
      'Négociation et suivi',
      'Contact via notre agence',
    ],
  },
  {
    id: 'premium',
    name: 'Formule Premium 360°',
    description: 'Expérience immersive complète',
    price: '8000 DZD',
    icon: 'fas fa-vr-cardboard',
    color: 'orange',
    recommended: true,
    features: [
      'Visite virtuelle 360° professionnelle',
      'Contact direct avec l\'acheteur',
      'Mise en avant prioritaire',
      'Réduction de 80% des visites physiques',
      'Disponible 24h/24 pour les visiteurs',
    ],
  },
];

export const ServiceComparison: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Choisissez votre <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">formule</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deux options adaptées à vos besoins, de la vente traditionnelle à l&apos;expérience immersive 360°
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {serviceTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative p-8 border-2 transition-all duration-300 hover:-translate-y-2 ${
                tier.color === 'green'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100'
                  : 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-100'
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                  RECOMMANDÉ
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className={`w-16 h-16 ${
                  tier.color === 'green' ? 'bg-green-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${tier.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{tier.name}</h3>
                <p className="text-gray-600 mt-2">{tier.description}</p>
                <div className={`text-3xl font-bold mt-4 ${
                  tier.color === 'green' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {tier.price}
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <i className={`fas fa-check-circle ${
                      tier.color === 'green' ? 'text-green-500' : 'text-orange-500'
                    } mr-3`}></i>
                    {feature}
                  </div>
                ))}
              </div>
              
              <Button
                className={`w-full ${
                  tier.color === 'green'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg text-white'
                }`}
              >
                {tier.color === 'green' ? 'Choisir cette formule' : 'Choisir Premium 360°'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};