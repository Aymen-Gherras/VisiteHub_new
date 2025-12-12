'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { companyInfo } from '../../../data/data/mockCompany';

export const ContactQuickActions = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Actions rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="w-full justify-center py-6"
              onClick={() => window.open(`tel:${companyInfo.phone}`)}
            >
              <i className="fas fa-phone mr-3"></i>
              Appeler maintenant
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-center py-6"
              onClick={() => window.open(`mailto:${companyInfo.email}`)}
            >
              <i className="fas fa-envelope mr-3"></i>
              Envoyer un email
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-center py-6"
              onClick={() => window.open('https://wa.me/213556267621', '_blank')}
            >
              <i className="fab fa-whatsapp mr-3"></i>
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};