'use client';

import { useState, useRef, useCallback } from 'react';
import { Property } from '../../../../../api';
import { apiService } from '../../../../../api';
import { useAuth } from '../../../../../context/AuthContext';

interface ImagesSectionProps {
  propertyData: Partial<Property>;
  setPropertyData: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  isUploading?: boolean;
}

export default function ImagesSection({ propertyData, setPropertyData, onNext, onPrevious }: ImagesSectionProps) {
  const { token } = useAuth();
  const [images, setImages] = useState<UploadedImage[]>(propertyData.images?.map((url, index) => ({
    id: `existing-${index}`,
    name: `Image ${index + 1}`,
    url,
    size: 0,
    type: 'image/jpeg'
  })) || []);
  const [dragActive, setDragActive] = useState(false);
  const [iframe360Link, setIframe360Link] = useState(propertyData.iframe360Link || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await apiService.uploadImage(file, token);
    return response.imageUrl;
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    setUploading(true);
    
    try {
      for (const file of newFiles) {
        // Create temporary image for preview
        const tempImage: UploadedImage = {
          id: `temp-${Date.now()}-${Math.random()}`,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          isUploading: true
        };

        setImages(prev => [...prev, tempImage]);

        try {
          // Upload to Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(file);
          
          // Update the image with the Cloudinary URL
          setImages(prev => prev.map(img => 
            img.id === tempImage.id 
              ? { ...img, url: cloudinaryUrl, isUploading: false }
              : img
          ));

          // Clean up the temporary blob URL
          URL.revokeObjectURL(tempImage.url);
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          
          // Remove failed upload from images list
          setImages(prev => prev.filter(img => img.id !== tempImage.id));
          
          // Clean up the temporary blob URL
          URL.revokeObjectURL(tempImage.url);
          
          // Show specific error message
          alert(`Failed to upload ${file.name}: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [token]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleDelete = (id: string) => {
    setImages(prev => {
      const imageToDelete = prev.find(img => img.id === id);
      if (imageToDelete && imageToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleNext = () => {
    const imageUrls = images.filter(img => !img.isUploading).map(img => img.url);
    setPropertyData({
      ...propertyData,
      images: imageUrls,
      iframe360Link: iframe360Link
    });
    onNext();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Images & 360° Tour</h2>
        <p className="text-gray-600">Upload high-quality photos and add 360° virtual tour if available</p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {dragActive ? 'Drop images here' : 'Upload Property Images'}
            </p>
            <p className="text-gray-500 mb-4">
              Drag and drop images here, or click to browse
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Choose Images
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {/* 360° Tour Link */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">360° Virtual Tour (Optional)</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            360° Tour Iframe Link
          </label>
          <input
            type="url"
            value={iframe360Link}
            onChange={(e) => setIframe360Link(e.target.value)}
            placeholder="https://example.com/360-tour-iframe"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500">
            Paste the iframe embed link from your 360° tour provider (e.g., Matterport, Kuula, etc.)
          </p>
        </div>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Uploaded Images ({images.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gray-100">
                  {image.isUploading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </div>
                
                {/* Image Info Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      title="Delete image"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 rounded-b-lg">
                  <p className="text-white text-sm font-medium truncate">{image.name}</p>
                  <p className="text-white text-xs opacity-75">{formatFileSize(image.size)}</p>
                </div>
                
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Upload Tips</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Upload at least 5-10 high-quality images</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Include exterior, interior, and key features</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Use good lighting and clear angles</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>First image will be the main cover photo</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span>Add 360° tour link to provide immersive experience</span>
          </li>
        </ul>
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
          disabled={images.length === 0 || uploading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{uploading ? 'Uploading...' : 'Next: Financing'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
