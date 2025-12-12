// components/home/CTASection.tsx
import React from 'react';
import { Button } from '../ui/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-green-600 via-lime-600 to-emarld-800 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Prêt à révolutionner la vente de votre bien ?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Rejoignez les centaines de propriétaires qui ont choisi VisiteHub pour une vente plus rapide et plus efficace
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg">
            <i className="fas fa-rocket mr-2"></i>
            Commencer maintenant
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
            <i className="fas fa-phone mr-2"></i>
            Nous contacter
          </Button>
        </div>
      </div>
    </section>
  );
};