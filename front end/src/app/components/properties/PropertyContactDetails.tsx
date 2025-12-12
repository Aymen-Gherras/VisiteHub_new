'use client';

import React from 'react';

type PropertyContactDetailsProps = {
  phoneNumber?: string;
  address: string;
  city?: string;
  wilaya: string;
};

export const PropertyContactDetails: React.FC<PropertyContactDetailsProps> = ({
  phoneNumber,
  address,
  city,
  wilaya
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Informations de Contact</h2>
      
      <div className="space-y-4">
        {phoneNumber && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600">
              <i className="fas fa-phone text-lg"></i>
            </div>
            <div>
              <div className="font-medium text-gray-800">Téléphone du propriétaire</div>
              <a 
                href={`tel:${phoneNumber}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                {phoneNumber}
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            <i className="fas fa-map-marker-alt text-lg"></i>
          </div>
          <div>
            <div className="font-medium text-gray-800">Adresse</div>
            <div className="text-gray-600">{address}{city ? `, ${city}` : ''}, {wilaya}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            <i className="fas fa-building text-lg"></i>
          </div>
          <div>
            <div className="font-medium text-gray-800">Agence VisiteHub</div>
            <div className="text-gray-600">contact@visitehub.com</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <i className="fas fa-info-circle"></i>
          <span className="font-medium">Besoin d'aide ?</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Notre équipe est disponible pour vous accompagner dans votre projet immobilier.
        </p>
      </div>
    </div>
  );
};
