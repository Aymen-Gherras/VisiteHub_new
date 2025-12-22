import { useState, useEffect } from 'react';
import { apiService, CreatePropertyDto, Property } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';

interface PropertyFormProps {
  property: Property | null;
  onSave: (property: Property) => void;
  onCancel: () => void;
}

export default function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePropertyDto>({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price?.toString() || '',
    type: property?.type || 'apartment',
    transactionType: property?.transactionType || 'vendre',
    bedrooms: property?.bedrooms || 0,
    etage: (property as any)?.etage ?? undefined,
    surface: property?.surface || 0,
    wilaya: property?.wilaya || '',
    daira: (property as any)?.daira || '',
    address: property?.address || '',
    iframe360Link: property?.iframe360Link || '',
    phoneNumber: property?.phoneNumber || '',
    mainImage: property?.mainImage,
    images: property?.images || [],
    rentPeriod: (property as any)?.rentPeriod || 'month',
    propertyOwnerType: property?.propertyOwnerType || 'Particulier',
    propertyOwnerName: property?.propertyOwnerName || undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }

    try {
      if (property) {
        // Update existing property
        const updatedProperty = await apiService.updateProperty(property.id, formData, token);
        onSave(updatedProperty);
      } else {
        // Create new property
        const newProperty = await apiService.createProperty(formData, token);
        onSave(newProperty);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
      console.error('Error saving property:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePropertyDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (DZD) *
          </label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder='e.g., 1,500,000 or "1 milliards" or "Sur demande"'
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter price as number (e.g., 1,500,000) or text (e.g., "1 milliards", "Sur demande")
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="villa">Villa</option>
            <option value="land">Terrain</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Type *
          </label>
          <select
            value={formData.transactionType}
            onChange={(e) => handleInputChange('transactionType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="vendre">Vente</option>
            <option value="location">Location</option>
          </select>
        </div>

        {/* Rent Period - Only show for rental properties */}
        {formData.transactionType === 'location' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rent Period *
            </label>
            <select
              value={formData.rentPeriod || 'month'}
              onChange={(e) => handleInputChange('rentPeriod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="month">Par mois</option>
              <option value="day">Par jour</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Surface (m²) *
          </label>
          <input
            type="number"
            value={formData.surface}
            onChange={(e) => handleInputChange('surface', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Étage
          </label>
          <input
            type="number"
            value={(formData as any).etage ?? ''}
            onChange={(e) => handleInputChange('etage' as any, e.target.value === '' ? undefined : Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max={100}
            placeholder="0 = rez-de-chaussée"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wilaya *
          </label>
          <input
            type="text"
            value={formData.wilaya}
            onChange={(e) => handleInputChange('wilaya', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daira *
          </label>
          <input
            type="text"
            value={(formData as any).daira || ''}
            onChange={(e) => handleInputChange('daira' as any, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the property, its features, and any important details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            360° Tour Link (Optional)
          </label>
          <input
            type="text"
            value={formData.iframe360Link}
            onChange={(e) => handleInputChange('iframe360Link', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste iframe embed code or URL"
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste the full iframe embed code or 360° tour URL
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+213 XXX XXX XXX"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {property ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  );
} 