'use client';

import { useState } from 'react';
import { Project, CreateProjectDto, apiService } from '../../../../../api';

// Extended type to handle both display and API formats
type ProjectFormData = Partial<Project> & {
  promoteurId?: string;
};

interface ImagesSectionProps {
  projectData: ProjectFormData;
  setProjectData: (data: ProjectFormData) => void;
  onPrevious: () => void;
  onProjectCreated: (project: Project) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  isEditing?: boolean;
  projectId?: string;
  token?: string;
}

export default function ImagesSection({
  projectData,
  setProjectData,
  onPrevious,
  onProjectCreated,
  isSubmitting,
  setIsSubmitting,
  isEditing,
  projectId,
  token
}: ImagesSectionProps) {
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string>(projectData.coverImage || '');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(projectData.images || []);
  const [uploadProgress, setUploadProgress] = useState<{ cover?: number; gallery?: number }>({});

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files]);
      
      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    // If it's a new file (not yet uploaded), remove from files array
    if (index >= (projectData.images?.length || 0)) {
      const fileIndex = index - (projectData.images?.length || 0);
      setGalleryFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'visitehub_preset');
    formData.append('folder', `projects/${folder}`);

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dqmhtibfm/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImageUrl = projectData.coverImage;
      let galleryUrls = [...(projectData.images || [])];

      // Upload cover image if new file selected
      if (coverImageFile) {
        setUploadProgress(prev => ({ ...prev, cover: 0 }));
        coverImageUrl = await uploadToCloudinary(coverImageFile, 'covers');
        setUploadProgress(prev => ({ ...prev, cover: 100 }));
      }

      // Upload gallery images if new files selected
      if (galleryFiles.length > 0) {
        setUploadProgress(prev => ({ ...prev, gallery: 0 }));
        
        for (let i = 0; i < galleryFiles.length; i++) {
          const url = await uploadToCloudinary(galleryFiles[i], 'gallery');
          galleryUrls.push(url);
          
          // Update progress
          const progress = Math.round(((i + 1) / galleryFiles.length) * 100);
          setUploadProgress(prev => ({ ...prev, gallery: progress }));
        }
      }

      const finalData = {
        ...projectData,
        coverImage: coverImageUrl,
        images: galleryUrls
      };

      let result: Project;
      if (isEditing && projectId) {
        result = await apiService.updateProject(projectId, finalData, token);
      } else {
        // Ensure required fields are present for creation
        if (!finalData.name || !finalData.promoteurId) {
          throw new Error('Project name and promoteur are required');
        }
        result = await apiService.createProject(finalData as CreateProjectDto, token);
      }

      onProjectCreated(result);
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Images & Gallery</h2>
        <p className="text-gray-600">Upload project cover image and gallery photos</p>
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Cover Image
        </label>
        
        <div className="space-y-4">
          {/* Cover Image Preview */}
          <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {coverImagePreview ? (
              <img
                src={coverImagePreview}
                alt="Cover image preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <span className="text-4xl text-gray-400">🏘️</span>
                <p className="text-sm text-gray-500 mt-2">Cover Image</p>
                <p className="text-xs text-gray-400">Main project image</p>
              </div>
            )}
          </div>

          {/* Cover Image Upload Input */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Wide image (16:9 ratio), minimum 1200x675px, PNG or JPG format
            </p>
            {uploadProgress.cover !== undefined && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.cover}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">Uploading cover image... {uploadProgress.cover}%</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Project Gallery (Optional)
        </label>
        
        {/* Gallery Preview */}
        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Upload Input */}
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <p className="text-xs text-gray-500 mt-2">
            Select multiple images to create a project gallery. Recommended: 1200x800px or higher, PNG or JPG format
          </p>
          {uploadProgress.gallery !== undefined && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.gallery}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">Uploading gallery... {uploadProgress.gallery}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Images Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">📸</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-800 mb-1">Project Visuals</h3>
            <p className="text-sm text-purple-700">
              High-quality images help showcase the project to potential buyers. The cover image will be 
              displayed in project listings, while gallery images provide detailed views of the development.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
