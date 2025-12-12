import { useState, useEffect } from 'react';
import { PropertyOwner, CreatePropertyOwnerDto, UpdatePropertyOwnerDto, PropertyOwnerType } from '../../../../api/types';
import { apiService } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';

interface PropertyOwnerFormProps {
  propertyOwner?: PropertyOwner;
  onSave: (propertyOwner: PropertyOwner) => void;
  onCancel: () => void;
}

export default function PropertyOwnerForm({ propertyOwner, onSave, onCancel }: PropertyOwnerFormProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState<CreatePropertyOwnerDto>({
    name: propertyOwner?.name || '',
    ownerType: propertyOwner?.ownerType || PropertyOwnerType.AGENCE,
    description: propertyOwner?.description || '',
    imageUrl: propertyOwner?.imageUrl || '',
    coverImage: propertyOwner?.coverImage || '',
    phoneNumber: propertyOwner?.phoneNumber || '',
    email: propertyOwner?.email || '',
    website: propertyOwner?.website || '',
    address: propertyOwner?.address || '',
    wilaya: propertyOwner?.wilaya || '',
    daira: propertyOwner?.daira || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    try {
      let savedOwner: PropertyOwner;
      
      if (propertyOwner) {
        // Update existing property owner
        savedOwner = await apiService.updatePropertyOwner(propertyOwner.id, formData as UpdatePropertyOwnerDto, token);
      } else {
        // Create new property owner
        savedOwner = await apiService.createPropertyOwner(formData, token);
      }
      
      onSave(savedOwner);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property owner');
      console.error('Error saving property owner:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePropertyOwnerDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File, field: 'imageUrl' | 'coverImage') => {
    if (!file) return;

    setUploadingImage(true);
    try {
      // Here you would implement Cloudinary upload
      // For now, we'll use a placeholder
      const imageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;
      handleInputChange(field, imageUrl);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="e.g., Century 21 Alger"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner Type *
            </label>
            <select
              value={formData.ownerType}
              onChange={(e) => handleInputChange('ownerType', e.target.value as PropertyOwnerType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={PropertyOwnerType.AGENCE}>Agence immobilière</option>
              <option value={PropertyOwnerType.PROMOTEUR}>Promotion immobilière</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the property owner..."
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="space-y-2">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Logo preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'imageUrl');
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">Upload company logo (recommended: 200x200px)</p>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="space-y-2">
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'coverImage');
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">Upload cover image for profile page (recommended: 1200x400px)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+213 21 XX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contact@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.example.com"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wilaya
            </label>
            <input
              type="text"
              value={formData.wilaya}
              onChange={(e) => handleInputChange('wilaya', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Alger"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daira
            </label>
            <input
              type="text"
              value={formData.daira}
              onChange={(e) => handleInputChange('daira', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Sidi M'Hamed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full address..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : propertyOwner ? 'Update Owner' : 'Create Owner'}
        </button>
      </div>
    </form>
  );
}
