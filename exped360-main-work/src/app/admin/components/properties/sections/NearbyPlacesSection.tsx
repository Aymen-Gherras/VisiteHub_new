'use client';

import React, { useState, useEffect } from 'react';
import { ApiService } from '@/api';
import { NearbyPlace, CreateNearbyPlaceDto } from '@/api';
import { isSvgIcon, getSvgIconPath, getCleanIconValue } from '@/app/utils/iconUtils';

interface NearbyPlacesSectionProps {
  propertyId?: string;
  propertyData: any;
  setPropertyData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Comprehensive icon list for nearby places (includes emoji icons + SVG icons)
const availableIcons = [
  // === EMOJI ICONS ===
  // Education
  { id: 'school', label: 'École', icon: '🏫', type: 'emoji' },
  { id: 'university', label: 'Université', icon: '🎓', type: 'emoji' },
  { id: 'library', label: 'Bibliothèque', icon: '📚', type: 'emoji' },
  // Medical
  { id: 'hospital', label: 'Hôpital', icon: '🏥', type: 'emoji' },
  { id: 'clinic', label: 'Clinique', icon: '🏥', type: 'emoji' },
  { id: 'lab', label: 'Laboratoire', icon: '🔬', type: 'emoji' },
  // Leisure
  { id: 'park', label: 'Parc', icon: '🌳', type: 'emoji' },
  { id: 'theater', label: 'Théâtre', icon: '🎭', type: 'emoji' },
  { id: 'stadium', label: 'Stade', icon: '⚽', type: 'emoji' },
  { id: 'mall', label: 'Centre commercial', icon: '🛍️', type: 'emoji' },
  { id: 'museum', label: 'Musée', icon: '🏛️', type: 'emoji' },
  { id: 'cinema', label: 'Cinéma', icon: '🎬', type: 'emoji' },
  // Transport
  { id: 'tram', label: 'Tramway', icon: '🚊', type: 'emoji' },
  { id: 'metro', label: 'Métro', icon: '🚇', type: 'emoji' },
  { id: 'train', label: 'Train', icon: '🚄', type: 'emoji' },
  { id: 'taxi', label: 'Taxi', icon: '🚕', type: 'emoji' },
  // Services
  { id: 'atm', label: 'Distributeur', icon: '🏧', type: 'emoji' },
  { id: 'post', label: 'Poste', icon: '📮', type: 'emoji' },
  { id: 'police', label: 'Police', icon: '🚓', type: 'emoji' },
  { id: 'fire', label: 'Pompiers', icon: '🚒', type: 'emoji' },
  // Food & Dining
  { id: 'cafe', label: 'Café', icon: '☕', type: 'emoji' },
  { id: 'bakery', label: 'Boulangerie', icon: '🥖', type: 'emoji' },
  { id: 'market', label: 'Marché', icon: '🛒', type: 'emoji' },
  // Recreation
  { id: 'beach', label: 'Plage', icon: '🏖️', type: 'emoji' },
  { id: 'pool', label: 'Piscine', icon: '🏊', type: 'emoji' },
  { id: 'playground', label: 'Aire de jeux', icon: '🛝', type: 'emoji' },
  // General
  { id: 'location', label: 'Lieu', icon: '📍', type: 'emoji' },
  { id: 'pin', label: 'Épingler', icon: '📌', type: 'emoji' },
  { id: 'marker', label: 'Marqueur', icon: '🔖', type: 'emoji' },
  
  // === SVG ICONS ===
  { id: 'bus-svg', label: 'Bus', icon: '008-bus-2.svg', type: 'svg' },
  { id: 'pharmacy-svg', label: 'Pharmacie', icon: '023-pharmacy.svg', type: 'svg' },
  { id: 'bank-svg', label: 'Banque', icon: 'Bank.svg', type: 'svg' },
  { id: 'supermarket-svg', label: 'Supermarché', icon: '019-supermarket.svg', type: 'svg' },
  { id: 'gas-station-svg', label: 'Station-service', icon: '020-gasoline station.svg', type: 'svg' },
  { id: 'fuel-pump-svg', label: 'Pompe à essence', icon: '013-fuel pump.svg', type: 'svg' },
  { id: 'gym-svg', label: 'Salle de sport', icon: 'Dumbbell. weight. fitness. exercise. strength.svg', type: 'svg' },
  { id: 'mosque-svg', label: 'Mosquée', icon: 'mosque.svg', type: 'svg' },
  { id: 'restaurant-svg', label: 'Restaurant', icon: 'Restaurant-01.svg', type: 'svg' },
  { id: 'pizza-svg', label: 'Pizza', icon: '-_pizza. Italian food. slice of pizza. oven-baked. fast food.svg', type: 'svg' },
  { id: 'school-svg', label: 'École', icon: 'school building.school building. educational institution. campus. schoolhouse.svg', type: 'svg' },
  { id: 'esps-svg', label: 'ESP', icon: 'esps.svg', type: 'svg' },
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

    if (nearbyPlaces.length >= 12) {
      alert('Maximum de 12 lieux à proximité autorisés');
      return;
    }

    // If creating new property, just add to local state
    if (!propertyId) {
      const newPlace: NearbyPlace = {
        id: `temp-${Date.now()}`,
        name: name.trim(),
        distance: distance.trim(),
        icon: getCleanIconValue(selectedIcon), // Clean the icon value before storing
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
          icon: getCleanIconValue(selectedIcon), // Clean the icon value before storing
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
              disabled={loading || !name.trim() || !distance.trim() || nearbyPlaces.length >= 12}
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
                {selectedIcon.endsWith('.svg') ? (
                  <img 
                    src={`/icons/nearby-places/${encodeURIComponent(selectedIcon)}`} 
                    alt="Selected icon"
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <span className="text-xl">{selectedIcon}</span>
                )}
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
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto icon-picker-container">
                <div className="p-3">
                  {/* Emoji Icons Section */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1">Emoji</h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                      {availableIcons.filter(icon => icon.type === 'emoji').map((iconOption) => (
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
                          <span className="text-xl block">{iconOption.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* SVG Icons Section */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1">Icônes SVG</h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                      {availableIcons.filter(icon => icon.type === 'svg').map((iconOption) => (
                        <button
                          key={iconOption.id}
                          type="button"
                          onClick={() => {
                            setSelectedIcon(iconOption.icon);
                            setShowIconPicker(false);
                          }}
                          className={`p-2 rounded-lg border-2 transition-all hover:shadow-md flex items-center justify-center ${
                            selectedIcon === iconOption.icon
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={iconOption.label}
                        >
                          <img 
                            src={`/icons/nearby-places/${encodeURIComponent(iconOption.icon)}`} 
                            alt={iconOption.label}
                            className="w-5 h-5 object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {nearbyPlaces.length >= 12 && (
          <p className="text-sm text-orange-600 mt-2">Maximum de 10 lieux atteint</p>
        )}
      </div>

      {/* List of Places */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Lieux ajoutés ({nearbyPlaces.length}/12)
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
              const isSvg = isSvgIcon(icon);
              return (
                <div
                  key={place.id}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all group relative"
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 ${isSvg ? 'p-1' : ''} shrink-0`}>
                    {isSvg ? (
                      <img 
                        src={getSvgIconPath(icon)} 
                        alt={icon.replace('.svg', '').replace(/-/g, ' ')}
                        className="w-full h-full object-contain"
                        style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(1352%) hue-rotate(142deg) brightness(94%) contrast(87%)' }}
                      />
                    ) : (
                      <span className="text-blue-600 text-base">{icon}</span>
                    )}
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

