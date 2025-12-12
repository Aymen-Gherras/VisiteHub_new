import { useState, useEffect } from 'react';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectStatus, PropertyOwner } from '../../../../api/types';
import { apiService } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [promoteurs, setPromoteurs] = useState<PropertyOwner[]>([]);
  
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: project?.name || '',
    description: project?.description || '',
    imageUrl: project?.imageUrl || '',
    coverImage: project?.coverImage || '',
    images: project?.images || [],
    address: project?.address || '',
    wilaya: project?.wilaya || '',
    daira: project?.daira || '',
    latitude: project?.latitude,
    longitude: project?.longitude,
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    expectedCompletionDate: project?.expectedCompletionDate ? new Date(project.expectedCompletionDate).toISOString().split('T')[0] : '',
    status: project?.status || ProjectStatus.PLANNING,
    totalUnits: project?.totalUnits || 0,
    availableUnits: project?.availableUnits || 0,
    propertyOwnerId: project?.propertyOwner?.id || '',
  });

  useEffect(() => {
    const fetchPromoteurs = async () => {
      try {
        const promoteursData = await apiService.getPromoteurs();
        setPromoteurs(promoteursData);
      } catch (err) {
        console.error('Error fetching promoteurs:', err);
      }
    };

    fetchPromoteurs();
  }, []);

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
      let savedProject: Project;
      
      if (project) {
        // Update existing project
        savedProject = await apiService.updateProject(project.id, formData as UpdateProjectDto, token);
      } else {
        // Create new project
        savedProject = await apiService.createProject(formData, token);
      }
      
      onSave(savedProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
      console.error('Error saving project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateProjectDto, value: any) => {
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
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="e.g., Les Jardins de Sidi Abdellah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promoteur *
            </label>
            <select
              value={formData.propertyOwnerId}
              onChange={(e) => handleInputChange('propertyOwnerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Promoteur</option>
              {promoteurs.map((promoteur) => (
                <option key={promoteur.id} value={promoteur.id}>
                  {promoteur.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={ProjectStatus.PLANNING}>Planning</option>
              <option value={ProjectStatus.CONSTRUCTION}>Construction</option>
              <option value={ProjectStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Units
            </label>
            <input
              type="number"
              value={formData.totalUnits}
              onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Units
            </label>
            <input
              type="number"
              value={formData.availableUnits}
              onChange={(e) => handleInputChange('availableUnits', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max={formData.totalUnits}
            />
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
            placeholder="Project description and features..."
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Project Image
            </label>
            <div className="space-y-2">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Project preview"
                  className="w-full h-32 object-cover rounded-lg border"
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
            </div>
          </div>
        </div>
      </div>

      {/* Location & Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location & Timeline</h3>
        
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
              placeholder="e.g., Sidi Abdellah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Completion
            </label>
            <input
              type="date"
              value={formData.expectedCompletionDate}
              onChange={(e) => handleInputChange('expectedCompletionDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              placeholder="Full project address..."
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
          {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
