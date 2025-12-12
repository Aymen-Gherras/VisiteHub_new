'use client';

import { useState } from 'react';
import { Promoteur, CreatePromoteurDto, apiService } from '../../../../../api';

interface ImagesSectionProps {
  promoteurData: Partial<Promoteur>;
  setPromoteurData: (data: Partial<Promoteur>) => void;
  onPrevious: () => void;
  onPromoteurCreated: (promoteur: Promoteur) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  isEditing?: boolean;
  promoteurId?: string;
  token?: string;
}

export default function ImagesSection({
  promoteurData,
  setPromoteurData,
  onPrevious,
  onPromoteurCreated,
  isSubmitting,
  setIsSubmitting,
  isEditing,
  promoteurId,
  token
}: ImagesSectionProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(promoteurData.logo || '');
  const [coverImagePreview, setCoverImagePreview] = useState<string>(promoteurData.coverImage || '');
  const [uploadProgress, setUploadProgress] = useState<{ logo?: number; cover?: number }>({});

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const uploadToCloudinary = async (file: File, type: 'logo' | 'cover'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'visitehub_preset');
    formData.append('folder', `promoteurs/${type}`);

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
      let logoUrl = promoteurData.logo;
      let coverImageUrl = promoteurData.coverImage;

      // Upload logo if new file selected
      if (logoFile) {
        setUploadProgress(prev => ({ ...prev, logo: 0 }));
        logoUrl = await uploadToCloudinary(logoFile, 'logo');
        setUploadProgress(prev => ({ ...prev, logo: 100 }));
      }

      // Upload cover image if new file selected
      if (coverImageFile) {
        setUploadProgress(prev => ({ ...prev, cover: 0 }));
        coverImageUrl = await uploadToCloudinary(coverImageFile, 'cover');
        setUploadProgress(prev => ({ ...prev, cover: 100 }));
      }

      const finalData = {
        ...promoteurData,
        logo: logoUrl,
        coverImage: coverImageUrl
      };

      let result: Promoteur;
      if (isEditing && promoteurId) {
        result = await apiService.updatePromoteur(promoteurId, finalData, token);
      } else {
        // Ensure required fields are present for creation
        if (!finalData.name) {
          throw new Error('Promoteur name is required');
        }
        result = await apiService.createPromoteur(finalData as CreatePromoteurDto, token);
      }

      onPromoteurCreated(result);
    } catch (error) {
      console.error('Error saving promoteur:', error);
      alert(error instanceof Error ? error.message : 'Failed to save promoteur');
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Images & Branding</h2>
        <p className="text-gray-600">Upload company logo and cover image for professional presentation</p>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Company Logo
        </label>
        
        <div className="flex items-start space-x-6">
          {/* Logo Preview */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <span className="text-3xl text-gray-400">🏗️</span>
                  <p className="text-xs text-gray-500 mt-1">Logo</p>
                </div>
              )}
            </div>
          </div>

          {/* Logo Upload Input */}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image (1:1 ratio), minimum 200x200px, PNG or JPG format
            </p>
            {uploadProgress.logo !== undefined && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.logo}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">Uploading logo... {uploadProgress.logo}%</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Cover Image (Optional)
        </label>
        
        <div className="space-y-4">
          {/* Cover Image Preview */}
          <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {coverImagePreview ? (
              <img
                src={coverImagePreview}
                alt="Cover image preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <span className="text-4xl text-gray-400">🏙️</span>
                <p className="text-sm text-gray-500 mt-2">Cover Image</p>
                <p className="text-xs text-gray-400">Optional banner image for company profile</p>
              </div>
            )}
          </div>

          {/* Cover Image Upload Input */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Wide image (16:9 ratio), minimum 1200x675px, PNG or JPG format
            </p>
            {uploadProgress.cover !== undefined && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.cover}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">Uploading cover image... {uploadProgress.cover}%</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Branding Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">🎨</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-800 mb-1">Professional Branding</h3>
            <p className="text-sm text-purple-700">
              A professional logo and cover image help establish trust and brand recognition. 
              The logo will appear in property listings and the cover image will be displayed on the company profile page.
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
              <span>{isEditing ? 'Update Promoteur' : 'Create Promoteur'}</span>
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
