import React from 'react';
import { companyInfo } from '../../../data/data/mockCompany';

export const ContactInfo = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-green-600 mb-4">
              <i className="fas fa-map-marker-alt text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Notre adresse</h3>
            <p className="text-gray-600">
              {companyInfo.address}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-green-600 mb-4">
              <i className="fas fa-phone-alt text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
            <p className="text-gray-600">
              <a href={`tel:${companyInfo.phone}`} className="hover:text-green-600 transition-colors">
                {companyInfo.phone}
              </a>
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-green-600 mb-4">
              <i className="fas fa-envelope text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-600">
              <a href={`mailto:${companyInfo.email}`} className="hover:text-green-600 transition-colors">
                {companyInfo.email}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Horaires d&apos;ouverture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Dimanche - Jeudi</h4>
                <p className="text-gray-600">9h00 - 18h00</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Samedi</h4>
                <p className="text-gray-600">10h00 - 16h00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};