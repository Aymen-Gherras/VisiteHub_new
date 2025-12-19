'use client';

import { useState } from 'react';
import { Property } from '../../../../../api';
import { apiService } from '../../../../../api';
import { useAuth } from '../../../../../context/AuthContext';

interface FinancingSectionProps {
  propertyData: Partial<Property>;
  setPropertyData: (data: Partial<Property>) => void;
  onPrevious: () => void;
  onPropertyCreated: (property: Property) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  isEditing?: boolean;
  propertyId?: string;
  token?: string;
}

export default function FinancingSection({ 
  propertyData, 
  setPropertyData, 
  onPrevious, 
  onPropertyCreated,
  isSubmitting,
  setIsSubmitting,
  isEditing,
  propertyId,
  token: propToken
}: FinancingSectionProps) {
  const { token: authToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const currentToken = propToken || authToken;
    
    if (!currentToken) {
      setError('Authentication required. Please log in.');
      return;
    }

    // Validate required fields
    const requiredFields = ['title', 'type', 'transactionType', 'price', 'surface', 'wilaya', 'daira', 'address'];
    const missingFields = requiredFields.filter(field => !propertyData[field as keyof Property]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Filter out system fields and non-DTO fields (amenities, images, nearbyPlaces)
      const { id, createdAt, updatedAt, viewCount, amenities, images, nearbyPlaces, ...propertyDataForBackend } = propertyData;
      
      // Ensure price is sent as a string (preserve full text like "1 milliards")
      const priceValue = propertyData.price;
      console.log('🔍 FinancingSection - Price before sending:', priceValue, 'Type:', typeof priceValue);
      
      // Add imageUrls to the payload when images were set (even empty array) so edits can clear images.
      const payload = {
        ...propertyDataForBackend,
        price: typeof priceValue === 'string' ? priceValue : String(priceValue || ''),
        ...(Array.isArray(images) && { imageUrls: images }),
        ...(propertyData.papers && propertyData.papers.length > 0 && { papers: propertyData.papers }),
      } as any;
      
      console.log('🔍 FinancingSection - Payload price:', payload.price, 'Type:', typeof payload.price);
      
      let newProperty: Property;
      
      if (isEditing && propertyId) {
        // Update existing property
        newProperty = await apiService.updateProperty(propertyId, payload as any, currentToken);
      } else {
        // Create new property
        newProperty = await apiService.createProperty(payload as any, currentToken);
      }

      // Save nearby places after property creation/update
      // Note: When editing, nearby places are saved immediately in NearbyPlacesSection,
      // so we only need to handle them for new properties
      if (!isEditing && propertyData.nearbyPlaces && propertyData.nearbyPlaces.length > 0) {
        try {
          // For new properties: Create all nearby places
          const placesToCreate = propertyData.nearbyPlaces.filter(p => p.id.startsWith('temp-') || !p.id);
          for (const place of placesToCreate) {
            await apiService.createNearbyPlace(
              {
                propertyId: newProperty.id,
                name: place.name,
                distance: place.distance,
                icon: place.icon || '📍',
                displayOrder: place.displayOrder || 0,
              },
              currentToken
            );
          }
        } catch (placeError) {
          console.error('Error saving nearby places:', placeError);
          // Don't fail the whole operation, just log the error
        }
      }
      
      // Reload property to get nearby places
      const updatedProperty = await apiService.getProperty(newProperty.id);
      onPropertyCreated(updatedProperty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
      console.error('Error saving property:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number | string) => {
    console.log('🔍 formatPrice called with:', price, 'Type:', typeof price);
    
    // If it's a number, format it
    if (typeof price === 'number') {
      return price.toLocaleString('fr-FR');
    }
    
    // If it's a string, return it as-is (user can include "DA" manually if needed)
    return price.trim();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your property details and submit to publish</p>
      </div>

      {/* Property Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Property Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium">{propertyData.title || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{propertyData.type || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction:</span>
                <span className="font-medium capitalize">{propertyData.transactionType || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{propertyData.price ? formatPrice(propertyData.price) : 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Surface:</span>
                <span className="font-medium">{propertyData.surface ? `${propertyData.surface} m²` : 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Apartment Type:</span>
                <span className="font-medium">{propertyData.apartmentType || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-medium">{propertyData.country || 'Algeria'}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Property Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrooms:</span>
                <span className="font-medium">{propertyData.bedrooms || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Étage:</span>
                <span className="font-medium">{typeof propertyData.etage === 'number' ? (propertyData.etage === 0 ? 'rez-de-chaussée' : propertyData.etage) : 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lieux à proximité:</span>
                <span className="font-medium">{propertyData.nearbyPlaces?.length || 0} lieux</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Images:</span>
                <span className="font-medium">{propertyData.images?.length || 0} uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">360° Tour:</span>
                <span className="font-medium">{propertyData.iframe360Link ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number:</span>
                <span className="font-medium">{propertyData.phoneNumber || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Latitude:</span>
                <span className="font-medium">{propertyData.latitude || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longitude:</span>
                <span className="font-medium">{propertyData.longitude || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3">Location</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-right max-w-xs">{propertyData.address || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daira:</span>
              <span className="font-medium">{propertyData.daira || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wilaya:</span>
              <span className="font-medium">{propertyData.wilaya || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {propertyData.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Description</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {propertyData.description}
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          {isEditing ? 'Ready to Update' : 'Ready to Publish'}
        </h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              {isEditing 
                ? 'Your property will be updated immediately after submission'
                : 'Your property will be published immediately after submission'
              }
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>You can edit the property anytime from your admin panel</span>
          </li>
          <li className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Potential buyers/renters will be able to view your property listing</span>
          </li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{isEditing ? 'Updating...' : 'Publishing...'}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{isEditing ? 'Update Property' : 'Publish Property'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
