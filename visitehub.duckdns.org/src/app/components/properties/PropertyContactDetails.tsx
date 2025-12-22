'use client';

import React from 'react';
import { apiService } from '../../../api';

type PropertyContactDetailsProps = {
  propertyId: string;
  phoneNumber?: string;
  address: string;
  city?: string;
  wilaya: string;
  propertyOwnerType?: string;
  propertyOwnerName?: string;
};

export const PropertyContactDetails: React.FC<PropertyContactDetailsProps> = ({
  propertyId,
  phoneNumber,
  address,
  city,
  wilaya,
  propertyOwnerType,
  propertyOwnerName,
}) => {
  const ownerDisplayName = (propertyOwnerName || '').trim() || propertyOwnerType;

  const recordClick = (type: 'PHONE' | 'WHATSAPP') => {
    if (!propertyId) return;
    try {
      // Best-effort; do not block navigation
      apiService.recordContactClick({ propertyId, type }).catch(() => undefined);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Informations de Contact
      </h2>

      <div className="space-y-4">
        {/* Property Owner Type - Only show for "Particulier" or other types (not Agence/Promotion) */}
        {propertyOwnerType && 
          propertyOwnerType !== 'Agence immobilière' && 
          propertyOwnerType !== 'Promotion immobilière' && (
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="text-purple-600">
              <i className="fas fa-user-tie text-lg"></i>
            </div>
            <div>
              <div className="font-medium text-gray-800">Propriétaire</div>
              <div className="text-gray-600">{ownerDisplayName}</div>
            </div>
          </div>
        )}

        {/* Property Owner Name - Only show for Agence immobilière or Promotion immobilière */}
        {propertyOwnerName &&
          (propertyOwnerType === 'Agence immobilière' ||
            propertyOwnerType === 'Promotion immobilière') && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-600">
                <i className="fas fa-building text-lg"></i>
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {propertyOwnerType === 'Agence immobilière'
                    ? "Nom de l'agence"
                    : 'Nom de la promotion'}
                </div>
                <div className="text-gray-600">{propertyOwnerName}</div>
              </div>
            </div>
          )}

        {/* Phone Number */}
        {phoneNumber && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600">
              <i className="fas fa-phone text-lg"></i>
            </div>
            <div>
              <div className="font-medium text-gray-800">
                Téléphone du propriétaire
              </div>
              <a
                href={`tel:${phoneNumber}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
                onClick={() => recordClick('PHONE')}
              >
                {phoneNumber}
              </a>
            </div>
          </div>
        )}

        {/* Address */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            <i className="fas fa-map-marker-alt text-lg"></i>
          </div>
          <div>
            <div className="font-medium text-gray-800">Adresse</div>
            <div className="text-gray-600">
              {address}
              {city ? `, ${city}` : ''}, {wilaya}
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        {phoneNumber && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Contacter le Propriétaire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Button - Green */}
              <a
                href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par votre annonce immobilière.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={() => recordClick('WHATSAPP')}
              >
                <i className="fab fa-whatsapp text-2xl"></i>
                <span>WhatsApp</span>
              </a>

              {/* Email Button - Slate */}
              <a
                href={`mailto:contact@visitehub.com?subject=${encodeURIComponent('Demande d\'information sur votre annonce')}&body=${encodeURIComponent('Bonjour,\n\nJe suis intéressé par votre annonce immobilière.\n\nCordialement,')}`}
                className="flex items-center justify-center gap-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <i className="fas fa-envelope text-xl"></i>
                <span>Email</span>
              </a>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-0.5">
              <i className="fas fa-info-circle text-lg"></i>
            </div>
            <div>
              <div className="font-medium text-blue-900 mb-1">Besoin d'aide ?</div>
              <p className="text-blue-800 text-sm leading-relaxed">
                Notre équipe est disponible pour vous accompagner dans votre projet
                immobilier. N'hésitez pas à nous contacter pour toute question.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
