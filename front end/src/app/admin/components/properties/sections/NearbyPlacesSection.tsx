'use client';

import React, { useState, useEffect } from 'react';
import { ApiService } from '@/api';
import { NearbyPlace, CreateNearbyPlaceDto } from '@/api';

interface NearbyPlacesSectionProps {
  propertyId?: string;
  propertyData: any;
  setPropertyData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Comprehensive icon list for nearby places (includes amenities icons + more)
const availableIcons = [
  // Education
  { id: 'school', label: 'École', icon: '🏫' },
  { id: 'university', label: 'Université', icon: '🎓' },
  { id: 'library', label: 'Bibliothèque', icon: '📚' },
  // Medical
  { id: 'hospital', label: 'Hôpital', icon: '🏥' },
  { id: 'pharmacy', label: 'Pharmacie', icon: '💊' },
  { id: 'clinic', label: 'Clinique', icon: '🏥' },
  { id: 'lab', label: 'Laboratoire', icon: '🔬' },
  // Leisure
  { id: 'park', label: 'Parc', icon: '🌳' },
  { id: 'gym', label: 'Salle de sport', icon: '💪' },
  { id: 'theater', label: 'Théâtre', icon: '🎭' },
  { id: 'stadium', label: 'Stade', icon: '⚽' },
  { id: 'mall', label: 'Centre commercial', icon: '🛍️' },
  { id: 'museum', label: 'Musée', icon: '🏛️' },
  { id: 'cinema', label: 'Cinéma', icon: '🎬' },
  // Transport
  { id: 'bus', label: 'Bus', icon: '🚌' },
  { id: 'tram', label: 'Tramway', icon: '🚊' },
  { id: 'metro', label: 'Métro', icon: '🚇' },
  { id: 'train', label: 'Train', icon: '🚄' },
  { id: 'taxi', label: 'Taxi', icon: '🚕' },
  // Services
  { id: 'bank', label: 'Banque', icon: '🏦' },
  { id: 'atm', label: 'Distributeur', icon: '🏧' },
  { id: 'post', label: 'Poste', icon: '📮' },
  { id: 'police', label: 'Police', icon: '🚓' },
  { id: 'fire', label: 'Pompiers', icon: '🚒' },
  // Food & Dining
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'cafe', label: 'Café', icon: '☕' },
  { id: 'bakery', label: 'Boulangerie', icon: '🥖' },
  { id: 'market', label: 'Marché', icon: '🛒' },
  { id: 'supermarket', label: 'Supermarché', icon: '🏪' },
  // Recreation
  { id: 'beach', label: 'Plage', icon: '🏖️' },
  { id: 'pool', label: 'Piscine', icon: '🏊' },
  { id: 'playground', label: 'Aire de jeux', icon: '🛝' },
  // General
  { id: 'location', label: 'Lieu', icon: '📍' },
  { id: 'pin', label: 'Épingler', icon: '📌' },
  { id: 'marker', label: 'Marqueur', icon: '🔖' },
];

export default function NearbyPlacesSection({
  propertyId,
  propertyData,
  setPropertyData,
  onNext,
  onPrevious,
}: NearbyPlacesSectionProps) {
  const api = new ApiService();
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [distance, setDistance] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('📍');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Load existing nearby places if editing
  useEffect(() => {
    if (propertyId) {
      loadNearbyPlaces();
    } else if (propertyData?.nearbyPlaces) {
      setNearbyPlaces(propertyData.nearbyPlaces);
    }
  }, [propertyId]);

  // Close icon picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showIconPicker) {
        const target = event.target as HTMLElement;
        if (!target.closest('.icon-picker-container')) {
          setShowIconPicker(false);
        }
      }
    };

    if (showIconPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showIconPicker]);

  const loadNearbyPlaces = async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const places = await api.getNearbyPlacesByProperty(propertyId);
      setNearbyPlaces(places);
    } catch (error) {
      console.error('Error loading nearby places:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || localStorage.getItem('authToken');
  };

  const handleAdd = async () => {
    if (!name.trim() || !distance.trim()) {
      alert('Veuillez remplir le nom et la distance');
      return;
    }

    if (nearbyPlaces.length >= 10) {
      alert('Maximum de 10 lieux à proximité autorisés');
      return;
    }

    // If creating new property, just add to local state
    if (!propertyId) {
      const newPlace: NearbyPlace = {
        id: `temp-${Date.now()}`,
        name: name.trim(),
        distance: distance.trim(),
        icon: selectedIcon,
        displayOrder: nearbyPlaces.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [...nearbyPlaces, newPlace];
      setNearbyPlaces(updated);
      setPropertyData({ ...propertyData, nearbyPlaces: updated });
      setName('');
      setDistance('');
      setSelectedIcon('📍');
      setShowIconPicker(false);
      return;
    }

    // If editing existing property, save to backend
    const token = getAuthToken();
    if (!token) {
      alert('Vous devez être connecté pour ajouter des lieux');
      return;
    }

    try {
      setLoading(true);
      const newPlace = await api.createNearbyPlace(
        {
          propertyId,
          name: name.trim(),
          distance: distance.trim(),
          icon: selectedIcon,
          displayOrder: nearbyPlaces.length,
        },
        token
      );
      const updated = [...nearbyPlaces, newPlace];
      setNearbyPlaces(updated);
      setPropertyData({ ...propertyData, nearbyPlaces: updated });
      setName('');
      setDistance('');
      setSelectedIcon('📍');
      setShowIconPicker(false);
    } catch (error) {
      console.error('Error adding nearby place:', error);
      alert('Erreur lors de l\'ajout du lieu');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    // If creating new property, just remove from local state
    if (id.startsWith('temp-')) {
      const updated = nearbyPlaces.filter(p => p.id !== id);
      setNearbyPlaces(updated);
      setPropertyData({ ...propertyData, nearbyPlaces: updated });
      return;
    }

    // If editing existing property, delete from backend
    if (!propertyId) return;
    const token = getAuthToken();
    if (!token) return;

    try {
      setLoading(true);
      await api.deleteNearbyPlace(id, token);
      const updated = nearbyPlaces.filter(p => p.id !== id);
      setNearbyPlaces(updated);
      setPropertyData({ ...propertyData, nearbyPlaces: updated });
    } catch (error) {
      console.error('Error removing nearby place:', error);
      alert('Erreur lors de la suppression du lieu');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setPropertyData({
      ...propertyData,
      nearbyPlaces: nearbyPlaces,
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lieux à proximité</h2>
        <p className="text-gray-600">Ajoutez les lieux à proximité de la propriété avec leur distance</p>
      </div>

      {/* Add Form */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du lieu *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Place name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={255}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance *
            </label>
            <input
              type="text"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="300 m"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">Ex: "300 m", "1.5 km"</p>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={loading || !name.trim() || !distance.trim() || nearbyPlaces.length >= 10}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône
          </label>
          <div className="relative icon-picker-container">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedIcon}</span>
                <span className="text-sm text-gray-700">Sélectionner une icône</span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${showIconPicker ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showIconPicker && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto icon-picker-container">
                <div className="p-3 grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {availableIcons.map((iconOption) => (
                    <button
                      key={iconOption.id}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(iconOption.icon);
                        setShowIconPicker(false);
                      }}
                      className={`p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                        selectedIcon === iconOption.icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={iconOption.label}
                    >
                      <span className="text-xl">{iconOption.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {nearbyPlaces.length >= 10 && (
          <p className="text-sm text-orange-600 mt-2">Maximum de 10 lieux atteint</p>
        )}
      </div>

      {/* List of Places */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Lieux ajoutés ({nearbyPlaces.length}/10)
        </h3>
        {nearbyPlaces.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun lieu ajouté pour le moment
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {nearbyPlaces.map((place, index) => {
              const icon = place.icon || '📍';
              const displayText = `${place.name} (${place.distance})`;
              return (
                <div
                  key={place.id}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all group relative"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-base shrink-0">
                    {icon}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{displayText}</span>
                  <button
                    onClick={() => handleRemove(place.id)}
                    disabled={loading}
                    className="ml-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Précédent
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

