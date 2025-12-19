'use client';

import { useCallback, useRef, useState } from 'react';
import { apiService } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';

type ImageDropzoneProps = {
  title: string;
  description?: string;
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  buttonText?: string;
};

export default function ImageDropzone({
  title,
  description,
  value,
  onChange,
  disabled,
  buttonText = 'Choose Image',
}: ImageDropzoneProps) {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (disabled) return;

      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        return;
      }

      setUploading(true);
      try {
        const res = await apiService.uploadImage(file, token ?? undefined);
        onChange(res.imageUrl);
      } catch (e) {
        console.error('Image upload failed:', e);
        alert(e instanceof Error ? e.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [disabled, onChange, token],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, [disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void uploadFile(file);
    },
    [disabled, uploadFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void uploadFile(file);
      e.target.value = '';
    },
    [uploadFile],
  );

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {description ? <p className="text-sm text-gray-500">{description}</p> : null}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-gray-500">
            <svg className="w-10 h-10 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div>
            <p className="text-base font-medium text-gray-900">
              {dragActive ? 'Drop image here' : uploading ? 'Uploading...' : 'Upload Image'}
            </p>
            <p className="text-gray-500">Drag and drop an image here, or click to browse</p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={disabled || uploading}
          >
            {buttonText}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      </div>

      {value ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          <img src={value} alt={title} className="w-full h-48 object-cover" />
        </div>
      ) : null}
    </div>
  );
}
