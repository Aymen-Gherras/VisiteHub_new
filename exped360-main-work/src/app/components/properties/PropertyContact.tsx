'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { ContactForm } from '../contact/ContactForm';

type ContactInfo = {
  name: string;
  phone: string;
  email: string;
  isAgency: boolean;
};

type Property = {
  id: string;
  title: string;
  contactInfo: ContactInfo;
};

type PropertyContactProps = {
  property: Property;
  onClose: () => void;
};

export const PropertyContact: React.FC<PropertyContactProps> = ({ property, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Contacter {property.contactInfo.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <ContactForm
          initialValues={{
            message: `Je suis intéressé par le bien: ${property.title}`,
          }}
          recipientPhone={property.contactInfo.phone}
          recipientEmail={property.contactInfo.email}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
};