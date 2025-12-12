import React from 'react';
import { companyInfo } from '../../../data/data/mockCompany';

export const ContactHero = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-lime-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Contactez {companyInfo.name}
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>
      </div>
    </div>
  );
};