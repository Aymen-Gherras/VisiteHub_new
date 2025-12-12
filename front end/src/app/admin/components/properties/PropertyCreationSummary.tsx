'use client';

import { useState } from 'react';

interface PropertyData {
  basicInfo: {
    title: string;
    type: string;
    transactionType: string;
    price: number;
    surface: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    description: string;
    features: string[];
  };
  amenities: {
    nearby: {
      education: boolean;
      medical: boolean;
      transport: boolean;
      leisure: boolean;
    };
    internal: {
      parking: boolean;
      elevator: boolean;
      security: boolean;
      garden: boolean;
    };
  };
  location: {
    wilaya: string;
    daira: string;
    address: string;
    coordinates: { lat: number; lng: number } | null;
  };
  images: File[];
  financing: {
    paymentMethod: string;
    downPayment: number;
    monthlyPayment: number;
  };
}

interface PropertyCreationSummaryProps {
  data: PropertyData;
  onSubmit: () => void;
  onEdit: (section: string) => void;
}

const propertyTypes = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Terrain' },
  { value: 'office', label: 'Bureau' },
  { value: 'shop', label: 'Commerce' }
];

const transactionTypes = [
  { value: 'sale', label: 'Vente' },
  { value: 'rent', label: 'Location' },
  { value: 'rental', label: 'Location Saisonnière' }
];

const paymentMethods = [
  { value: 'cash', label: 'Comptant' },
  { value: 'credit', label: 'Crédit Bancaire' },
  { value: 'lease', label: 'Location-Vente' },
  { value: 'installment', label: 'Vente à Tempérament' }
];

export default function PropertyCreationSummary({ data, onSubmit, onEdit }: PropertyCreationSummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would submit the data to your API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onSubmit();
    } catch (error) {
      console.error('Error submitting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedAmenities = (section: 'nearby' | 'internal') => {
    const amenities = section === 'nearby' ? data.amenities.nearby : data.amenities.internal;
    return Object.entries(amenities)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key)
      .length;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Récapitulatif de la Propriété</h2>
        <p className="text-gray-600">Vérifiez toutes les informations avant de créer la propriété</p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Informations de Base</h3>
          <button
            onClick={() => onEdit('basic-info')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Modifier
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Titre:</span> {data.basicInfo.title || 'Non spécifié'}</div>
          <div><span className="font-medium">Type:</span> {propertyTypes.find(t => t.value === data.basicInfo.type)?.label || 'Non spécifié'}</div>
          <div><span className="font-medium">Transaction:</span> {transactionTypes.find(t => t.value === data.basicInfo.transactionType)?.label || 'Non spécifié'}</div>
          <div><span className="font-medium">Prix:</span> {data.basicInfo.price ? `${data.basicInfo.price.toLocaleString('fr-FR')} DA` : 'Non spécifié'}</div>
          <div><span className="font-medium">Surface:</span> {data.basicInfo.surface ? `${data.basicInfo.surface} m²` : 'Non spécifié'}</div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Détails</h3>
          <button
            onClick={() => onEdit('details')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Modifier
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Chambres:</span> {data.details.bedrooms}</div>
          <div><span className="font-medium">Salles de bain:</span> {data.details.bathrooms}</div>
          <div><span className="font-medium">Caractéristiques:</span> {data.details.features.length} sélectionnées</div>
          <div><span className="font-medium">Description:</span> {data.details.description ? `${data.details.description.length} caractères` : 'Non spécifiée'}</div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Équipements</h3>
          <button
            onClick={() => onEdit('amenities')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Modifier
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">À proximité:</span> {getSelectedAmenities('nearby')} équipements</div>
          <div><span className="font-medium">Intégrés:</span> {getSelectedAmenities('internal')} aménagements</div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Localisation</h3>
          <button
            onClick={() => onEdit('location')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Modifier
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Wilaya:</span> {data.location.wilaya || 'Non spécifiée'}</div>
          <div><span className="font-medium">Daira:</span> {data.location.daira || 'Non spécifiée'}</div>
          <div><span className="font-medium">Adresse:</span> {data.location.address || 'Non spécifiée'}</div>
          <div><span className="font-medium">GPS:</span> {data.location.coordinates ? `${data.location.coordinates.lat}, ${data.location.coordinates.lng}` : 'Non spécifiées'}</div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Images</h3>
          <button
            onClick={() => onEdit('images')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Modifier
          </button>
        </div>
        <div className="text-sm">
          <span className="font-medium">Nombre d'images:</span> {data.images.length}
        </div>
        {data.images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {data.images.slice(0, 4).map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {data.images.length > 4 && (
              <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                +{data.images.length - 4} autres
              </div>
            )}
          </div>
        )}
      </div>

      {/* Financing */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Financement</h3>
          <button
            onClick={() => onEdit('financing')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Modifier
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Mode de paiement:</span> {paymentMethods.find(m => m.value === data.financing.paymentMethod)?.label || 'Non spécifié'}</div>
          <div><span className="font-medium">Apport initial:</span> {data.financing.downPayment ? `${data.financing.downPayment.toLocaleString('fr-FR')} DA` : 'Non spécifié'}</div>
          {data.financing.monthlyPayment > 0 && (
            <div><span className="font-medium">Mensualité:</span> {data.financing.monthlyPayment.toLocaleString('fr-FR')} DA</div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Création en cours...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Créer la Propriété</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
