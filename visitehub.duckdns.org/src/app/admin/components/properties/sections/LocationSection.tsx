'use client';

import { useEffect, useState } from 'react';
import { Property } from '../../../../../api';
import { apiService } from '../../../../../api';

interface LocationSectionProps {
  propertyData: Partial<Property>;
  setPropertyData: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const algerianWilayas: string[] = [];

export default function LocationSection({ propertyData, setPropertyData, onNext, onPrevious }: LocationSectionProps) {
  const [wilayas, setWilayas] = useState<string[]>(algerianWilayas);
  const [availableDairas, setAvailableDairas] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    apiService.listWilayas()
      .then((w) => {
        if (!mounted) return;
        const sorted = [...w].sort((a, b) => a.localeCompare(b, 'fr'));
        setWilayas(sorted);
        if (propertyData.wilaya) {
          apiService.listDairas(propertyData.wilaya)
            .then((d) => { if (mounted) setAvailableDairas(d || []); })
            .catch(() => {});
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setLoadError('Impossible de charger la liste complète des dairas. Veuillez réessayer.');
        console.error(err);
      });
    return () => { mounted = false; };
  }, []);

  const handleWilayaChange = (wilaya: string) => {
    apiService.listDairas(wilaya)
      .then((d) => setAvailableDairas(d || []))
      .catch(() => setAvailableDairas([]));
    setPropertyData({ ...propertyData, wilaya, daira: '' });
  };

  const handleDairaChange = (daira: string) => {
    setPropertyData({ ...propertyData, daira });
  };

  const handleAddressChange = (address: string) => {
    setPropertyData({ ...propertyData, address });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Localisation</h2>
        <p className="text-gray-600">Définissez l'emplacement exact de votre propriété</p>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Wilaya Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Wilaya *
        </label>
        <select
          value={propertyData.wilaya || ''}
          onChange={(e) => handleWilayaChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Sélectionnez une wilaya</option>
          {wilayas.map((wilaya) => (
            <option key={wilaya} value={wilaya}>
              {wilaya}
            </option>
          ))}
        </select>
      </div>

      {/* Daira Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Daira *
        </label>
        <select
          value={propertyData.daira || ''}
          onChange={(e) => handleDairaChange(e.target.value)}
          disabled={!propertyData.wilaya}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">{propertyData.wilaya ? 'Sélectionnez une daira' : 'Choisissez d\'abord une wilaya'}</option>
          {availableDairas.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Adresse Complète *
        </label>
        <textarea
          value={propertyData.address || ''}
          onChange={(e) => handleAddressChange(e.target.value)}
          rows={3}
          placeholder="Ex: 123 Rue de la Liberté, Quartier Belouizdad, 16000 Alger"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Location Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Résumé de la Localisation</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><span className="font-medium">Wilaya:</span> {propertyData.wilaya || 'Non spécifiée'}</p>
          <p><span className="font-medium">Daira:</span> {propertyData.daira || 'Non spécifiée'}</p>
          <p><span className="font-medium">Adresse:</span> {propertyData.address || 'Non spécifiée'}</p>
        </div>
      </div>

      {/* Quick Location Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-900 mb-2">💡 Conseils pour une bonne localisation</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Précisez le quartier ou la zone pour faciliter la recherche</li>
          <li>• Mentionnez les points de repère importants (métro, écoles, commerces)</li>
          <li>• Incluez le code postal si possible</li>
          <li>• Une adresse précise aide les visiteurs à localiser facilement votre propriété</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Précédent
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
