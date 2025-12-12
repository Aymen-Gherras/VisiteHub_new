import React from 'react';
// Update the import path below if the Card component is located at src/components/ui/Card.tsx
import { Card } from '../ui/Card';

interface ComparisonItem {
  icon: string;
  text: string;
}

const withoutVisiteHub: ComparisonItem[] = [
  { icon: 'fas fa-exclamation-triangle', text: '20+ visites physiques nécessaires' },
  { icon: 'fas fa-clock', text: 'Disponibilité 7j/7 pour les visites' },
  { icon: 'fas fa-mobile-alt', text: 'Photos smartphone peu attractives' },
  { icon: 'fas fa-handshake', text: 'Négociations compliquées' },
  { icon: 'fas fa-calendar', text: 'Vente qui traîne en longueur' },
];

const withVisiteHub: ComparisonItem[] = [
  { icon: 'fas fa-user-check', text: '3-5 visites physiques qualifiées seulement' },
  { icon: 'fas fa-globe', text: 'Visites virtuelles 24h/24' },
  { icon: 'fas fa-vr-cardboard', text: 'Visite 360° immersive professionnelle' },
  { icon: 'fas fa-digital-tachograph', text: 'Plateforme digitale simplifiée' },
  { icon: 'fas fa-rocket', text: 'Mise en valeur maximale, vente accélérée' },
];

export const BeforeAfterSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            L&apos;impact <span className="bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">VisiteHub</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Without VisiteHub */}
          <Card className="bg-red-50 border-l-4 border-red-500 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-times text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-red-800">Sans VisiteHub</h3>
            </div>
            
            <div className="space-y-4 text-red-700">
              {withoutVisiteHub.map((item, index) => (
                <div key={index} className="flex items-center">
                  <i className={`${item.icon} mr-3`}></i>
                  {item.text}
                </div>
              ))}
            </div>
          </Card>
          
          {/* With VisiteHub */}
          <Card className="bg-green-50 border-l-4 border-green-500 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-check text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-green-800">Avec VisiteHub</h3>
            </div>
            
            <div className="space-y-4 text-green-700">
              {withVisiteHub.map((item, index) => (
                <div key={index} className="flex items-center">
                  <i className={`${item.icon} mr-3`}></i>
                  {item.text}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};