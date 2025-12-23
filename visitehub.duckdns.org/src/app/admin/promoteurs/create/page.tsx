'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';
import type { Promoteur } from '../../../../api';
import ImageDropzone from '../../components/common/ImageDropzone';

export default function CreatePromoteur() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [dairas, setDairas] = useState<string[]>([]);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [projectSlugManuallyEdited, setProjectSlugManuallyEdited] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [createdPromoteur, setCreatedPromoteur] = useState<Promoteur | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    email: '',
    phoneNumber: '',
    address: '',
    wilaya: '',
    daira: '',
    website: '',
    logo: '',
    coverImage: '',
  });

  const [projectData, setProjectData] = useState({
    name: '',
    slug: '',
    description: '',
    wilaya: '',
    daira: '',
    address: '',
    status: 'planning' as 'completed' | 'construction' | 'planning' | 'suspended',
    coverImage: '',
  });

  // Fetch wilayas on mount
  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        const data = await apiService.listWilayas();
        setWilayas(data);
      } catch (err) {
        console.error('Error fetching wilayas:', err);
      }
    };
    fetchWilayas();
  }, []);

  // Fetch dairas when wilaya changes (Step 1)
  useEffect(() => {
    const fetchDairas = async () => {
      if (!formData.wilaya) {
        setDairas([]);
        return;
      }
      try {
        const data = await apiService.listDairas(formData.wilaya);
        setDairas(data);
      } catch (err) {
        console.error('Error fetching dairas:', err);
        setDairas([]);
      }
    };
    fetchDairas();
  }, [formData.wilaya]);

  // Fetch dairas when project wilaya changes (Step 2)
  useEffect(() => {
    const fetchDairas = async () => {
      if (!projectData.wilaya) {
        setDairas([]);
        return;
      }
      try {
        const data = await apiService.listDairas(projectData.wilaya);
        setDairas(data);
      } catch (err) {
        console.error('Error fetching dairas:', err);
        setDairas([]);
      }
    };
    if (step === 2) fetchDairas();
  }, [projectData.wilaya, step]);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'slug') {
      setSlugManuallyEdited(value.trim().length > 0);
      setFormData(prev => ({ ...prev, slug: value }));
      return;
    }

    if (name === 'name') {
      setFormData(prev => ({ ...prev, name: value, slug: slugManuallyEdited ? prev.slug : slugify(value) }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'slug') {
      setProjectSlugManuallyEdited(value.trim().length > 0);
      setProjectData(prev => ({ ...prev, slug: value }));
      return;
    }

    if (name === 'name') {
      setProjectData(prev => ({ ...prev, name: value, slug: projectSlugManuallyEdited ? prev.slug : slugify(value) }));
      return;
    }

    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        email: formData.email.trim() ? formData.email.trim() : undefined,
        website: formData.website.trim() ? formData.website.trim() : undefined,
      };
      const promoteur = await apiService.createPromoteur(payload as any, token);
      setCreatedPromoteur(promoteur);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error creating promoteur:', err);
      setError(err instanceof Error ? err.message : 'Failed to create promoteur');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (!createdPromoteur?.id) {
      setError('Promoteur was not created correctly.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.createPromoteurProject(createdPromoteur.id, projectData, token);
      router.push('/admin/promoteurs');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Promoteur</h1>
              <p className="mt-2 text-gray-600">
                Add a new real estate promoter
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/promoteurs')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Promoteurs
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error creating promoteur</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Step header */}
        <div className="mb-6 flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${step === 1 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
            1) Promoteur
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${step === 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
            2) Project
          </div>
        </div>

        {/* Step 1: Promoteur Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter promoteur name"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="promoteur-name"
              />
              <p className="mt-1 text-sm text-gray-500">URL-friendly identifier (auto-generated from name)</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@promoteur.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+213 XXX XXX XXX"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the promoteur..."
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            {/* Wilaya and Daira */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-2">
                  Wilaya
                </label>
                <select
                  id="wilaya"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Wilaya</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="daira" className="block text-sm font-medium text-gray-700 mb-2">
                  Daira
                </label>
                <select
                  id="daira"
                  name="daira"
                  value={formData.daira}
                  onChange={handleChange}
                  disabled={!formData.wilaya}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Daira</option>
                  {dairas.map((daira) => (
                    <option key={daira} value={daira}>
                      {daira}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.promoteur.com"
              />
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageDropzone
                title="Promoteur Logo"
                description="Shown on promoteur cards and profile"
                value={formData.logo}
                onChange={(url) => setFormData(prev => ({ ...prev, logo: url }))}
                buttonText="Choose Logo"
              />
              <ImageDropzone
                title="Promoteur Cover Image"
                description="Shown as the promoteur header/hero image"
                value={formData.coverImage}
                onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                buttonText="Choose Cover"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/promoteurs')}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Creating...' : 'Create Promoteur'}
            </button>
          </div>
        </form>
        )}

        {/* Step 2: Project Form */}
        {step === 2 && (
          <form onSubmit={handleCreateProject} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-900">
                  Promoteur created: <span className="font-semibold">{createdPromoteur?.name}</span>. Now create the first project inside this promoteur.
                </div>
              </div>

              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="project-name"
                  name="name"
                  value={projectData.name}
                  onChange={handleProjectChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Résidence El Bahia"
                />
              </div>

              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="project-description"
                  name="description"
                  value={projectData.description}
                  onChange={handleProjectChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Project description"
                />
              </div>

              <div>
                <label htmlFor="project-status" className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket / Statut
                </label>
                <select
                  id="project-status"
                  name="status"
                  value={(projectData as any).status || 'planning'}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">Planifié</option>
                  <option value="construction">En cours</option>
                  <option value="completed">Livré</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="project-wilaya" className="block text-sm font-medium text-gray-700 mb-2">
                    Wilaya
                  </label>
                  <select
                    id="project-wilaya"
                    name="wilaya"
                    value={projectData.wilaya}
                    onChange={handleProjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select wilaya</option>
                    {wilayas.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="project-daira" className="block text-sm font-medium text-gray-700 mb-2">
                    Daira
                  </label>
                  <select
                    id="project-daira"
                    name="daira"
                    value={projectData.daira}
                    onChange={handleProjectChange}
                    disabled={!projectData.wilaya || dairas.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select daira</option>
                    {dairas.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="project-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="project-address"
                  name="address"
                  value={projectData.address}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Address"
                />
              </div>

              <ImageDropzone
                title="Project Cover Image"
                description="Shown on project card and project header"
                value={projectData.coverImage}
                onChange={(url) => setProjectData(prev => ({ ...prev, coverImage: url }))}
                buttonText="Choose Cover"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/promoteurs')}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
