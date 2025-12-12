'use client';

import { useState } from 'react';
import { Property } from '../../../../../api';

interface AmenitiesSectionProps {
  propertyData: Partial<Property>;
  setPropertyData: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const internalAmenities = [
  { id: 'parking', label: 'Parking', icon: '🚗', category: 'Parking' },
  { id: 'elevator', label: 'Elevator', icon: '🛗', category: 'Building' },
  { id: 'security', label: 'Security System', icon: '🔒', category: 'Security' },
  { id: 'air-conditioning', label: 'Air Conditioning', icon: '❄️', category: 'Comfort' },
  { id: 'heating', label: 'Heating', icon: '🔥', category: 'Comfort' },
  { id: 'furnished', label: 'Furnished', icon: '🪑', category: 'Interior' },
  { id: 'balcony', label: 'Balcony', icon: '🌿', category: 'Exterior' },
  { id: 'terrace', label: 'Terrace', icon: '🏞️', category: 'Exterior' },
  { id: 'garden', label: 'Garden', icon: '🌺', category: 'Exterior' },
  { id: 'pool', label: 'Swimming Pool', icon: '🏊', category: 'Luxury' },
  { id: 'gym', label: 'Gym', icon: '💪', category: 'Luxury' },
  { id: 'internet', label: 'High-Speed Internet', icon: '📶', category: 'Technology' }
];

const nearbyAmenities = [
  { id: 'schools', label: 'Schools', icon: '🏫', category: 'Education' },
  { id: 'hospitals', label: 'Hospitals', icon: '🏥', category: 'Healthcare' },
  { id: 'shopping', label: 'Shopping Centers', icon: '🛍️', category: 'Shopping' },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️', category: 'Food' },
  { id: 'transport', label: 'Public Transport', icon: '🚌', category: 'Transport' },
  { id: 'banks', label: 'Banks', icon: '🏦', category: 'Services' },
  { id: 'parks', label: 'Parks', icon: '🌳', category: 'Recreation' },
  { id: 'beach', label: 'Beach', icon: '🏖️', category: 'Recreation' }
];

export default function AmenitiesSection({ propertyData, setPropertyData, onNext, onPrevious }: AmenitiesSectionProps) {
  const [selectedInternal, setSelectedInternal] = useState<string[]>(propertyData.amenities || []);
  const [selectedNearby, setSelectedNearby] = useState<string[]>([]);

  const handleInternalToggle = (amenityId: string) => {
    setSelectedInternal(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleNearbyToggle = (amenityId: string) => {
    setSelectedNearby(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleNext = () => {
    setPropertyData({
      ...propertyData,
      amenities: selectedInternal
    });

    onNext();
  };

  const getAmenitiesByCategory = (amenities: typeof internalAmenities) => {
    const categories = [...new Set(amenities.map(a => a.category))];
    return categories.map(category => ({
      category,
      amenities: amenities.filter(a => a.category === category)
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Amenities</h2>
        <p className="text-gray-600">Select the features and facilities available in and around the property</p>
      </div>

      {/* Internal Amenities */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Property Features</h3>
        <div className="space-y-6">
          {getAmenitiesByCategory(internalAmenities).map(({ category, amenities }) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-700 mb-3">{category}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenities.map((amenity) => (
                  <button
                    key={amenity.id}
                    onClick={() => handleInternalToggle(amenity.id)}
                    className={`
                      flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md
                      ${selectedInternal.includes(amenity.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="text-lg">{amenity.icon}</span>
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Amenities */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nearby Facilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {nearbyAmenities.map((amenity) => (
            <button
              key={amenity.id}
              onClick={() => handleNearbyToggle(amenity.id)}
              className={`
                flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md
                ${selectedNearby.includes(amenity.id)
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="text-lg">{amenity.icon}</span>
              <span className="text-sm font-medium">{amenity.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Amenities</h3>
        
        {selectedInternal.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Property Features ({selectedInternal.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedInternal.map(amenityId => {
                const amenity = internalAmenities.find(a => a.id === amenityId);
                return (
                  <span
                    key={amenityId}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{amenity?.icon}</span>
                    <span>{amenity?.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {selectedNearby.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Nearby Facilities ({selectedNearby.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedNearby.map(amenityId => {
                const amenity = nearbyAmenities.find(a => a.id === amenityId);
                return (
                  <span
                    key={amenityId}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    <span>{amenity?.icon}</span>
                    <span>{amenity?.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {selectedInternal.length === 0 && selectedNearby.length === 0 && (
          <p className="text-gray-500 text-sm">No amenities selected yet</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
        >
          <span>Next: Images</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
