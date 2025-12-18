'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService, CreateProjectDto, Project, UpdateProjectDto } from '../../../../../api';
import { useAuth } from '../../../../../context/AuthContext';

export default function EditPromoteur() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const promoteurId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [dairas, setDairas] = useState<string[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectSaving, setProjectSaving] = useState(false);
  const [editProjectData, setEditProjectData] = useState<UpdateProjectDto>({});
  const [editProjectDairas, setEditProjectDairas] = useState<string[]>([]);

  const [newProjectData, setNewProjectData] = useState<CreateProjectDto>({
    name: '',
    slug: '',
    description: '',
    wilaya: '',
    daira: '',
    address: '',
  });
  const [newProjectDairas, setNewProjectDairas] = useState<string[]>([]);

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
  });

  // Fetch promoteur data on mount
  useEffect(() => {
    const fetchPromoteur = async () => {
      if (!promoteurId) return;
      
      try {
        setLoading(true);
        const promoteur = await apiService.getPromoteur(promoteurId);
        setFormData({
          name: promoteur.name || '',
          slug: promoteur.slug || '',
          description: promoteur.description || '',
          email: promoteur.email || '',
          phoneNumber: promoteur.phoneNumber || '',
          address: promoteur.address || '',
          wilaya: promoteur.wilaya || '',
          daira: promoteur.daira || '',
          website: promoteur.website || '',
          logo: promoteur.logo || '',
        });
      } catch (err) {
        console.error('Error fetching promoteur:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch promoteur');
      } finally {
        setLoading(false);
      }
    };
    fetchPromoteur();
  }, [promoteurId]);

  // Fetch projects for this promoteur
  useEffect(() => {
    const fetchProjects = async () => {
      if (!promoteurId) return;
      try {
        setProjectsLoading(true);
        setProjectsError(null);
        const list = await apiService.listPromoteurProjects(promoteurId);
        setProjects(list);
      } catch (err) {
        console.error('Error fetching promoteur projects:', err);
        setProjectsError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [promoteurId]);

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

  // Fetch dairas when wilaya changes
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

  // Fetch dairas for new project when project wilaya changes
  useEffect(() => {
    const fetchProjectDairas = async () => {
      if (!newProjectData.wilaya) {
        setNewProjectDairas([]);
        return;
      }
      try {
        const data = await apiService.listDairas(newProjectData.wilaya);
        setNewProjectDairas(data);
      } catch (err) {
        console.error('Error fetching project dairas:', err);
        setNewProjectDairas([]);
      }
    };
    fetchProjectDairas();
  }, [newProjectData.wilaya]);

  // Fetch dairas for edit project when editProjectData.wilaya changes
  useEffect(() => {
    const fetchEditProjectDairas = async () => {
      const wilaya = (editProjectData as any).wilaya as string | undefined;
      if (!wilaya) {
        setEditProjectDairas([]);
        return;
      }
      try {
        const data = await apiService.listDairas(wilaya);
        setEditProjectDairas(data);
      } catch (err) {
        console.error('Error fetching edit project dairas:', err);
        setEditProjectDairas([]);
      }
    };
    fetchEditProjectDairas();
  }, [(editProjectData as any).wilaya]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProjectData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'wilaya') {
        next.daira = '';
      }
      return next;
    });
  };

  const handleEditProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditProjectData((prev) => {
      const next: any = { ...prev, [name]: value };
      if (name === 'wilaya') {
        next.daira = '';
      }
      return next;
    });
  };

  const refreshProjects = async () => {
    if (!promoteurId) return;
    const list = await apiService.listPromoteurProjects(promoteurId);
    setProjects(list);
  };

  const startEditProject = (project: Project) => {
    setProjectsError(null);
    setEditingProjectId(project.id);
    setEditProjectData({
      name: project.name || '',
      slug: project.slug || '',
      description: project.description || '',
      wilaya: project.wilaya || '',
      daira: project.daira || '',
      address: project.address || '',
      floorsCount: project.floorsCount,
      unitsPerFloor: project.unitsPerFloor,
    });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditProjectData({});
    setEditProjectDairas([]);
  };

  const submitEditProject = async (projectId: string) => {
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }
    if (!promoteurId) {
      setProjectsError('Promoteur ID is missing');
      return;
    }
    setProjectSaving(true);
    setProjectsError(null);
    try {
      await apiService.updatePromoteurProject(promoteurId, projectId, editProjectData, token);
      await refreshProjects();
      cancelEditProject();
    } catch (err) {
      console.error('Error updating project:', err);
      setProjectsError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setProjectSaving(false);
    }
  };

  const submitNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }
    if (!promoteurId) {
      setProjectsError('Promoteur ID is missing');
      return;
    }
    if (!newProjectData.name?.trim()) {
      setProjectsError('Project name is required');
      return;
    }
    setProjectSaving(true);
    setProjectsError(null);
    try {
      const payload: CreateProjectDto = {
        ...newProjectData,
        name: newProjectData.name.trim(),
        slug: newProjectData.slug?.trim() || undefined,
        description: newProjectData.description?.trim() || undefined,
        wilaya: newProjectData.wilaya || undefined,
        daira: newProjectData.daira || undefined,
        address: newProjectData.address?.trim() || undefined,
      };
      await apiService.createPromoteurProject(promoteurId, payload, token);
      await refreshProjects();
      setNewProjectData({
        name: '',
        slug: '',
        description: '',
        wilaya: '',
        daira: '',
        address: '',
      });
      setNewProjectDairas([]);
    } catch (err) {
      console.error('Error creating project:', err);
      setProjectsError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setProjectSaving(false);
    }
  };

  const deleteProject = async (project: Project) => {
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }
    if (!promoteurId) {
      setProjectsError('Promoteur ID is missing');
      return;
    }
    const ok = window.confirm(`Delete project "${project.name}"?`);
    if (!ok) return;
    setProjectSaving(true);
    setProjectsError(null);
    try {
      await apiService.deletePromoteurProject(promoteurId, project.id, token);
      await refreshProjects();
      if (editingProjectId === project.id) cancelEditProject();
    } catch (err) {
      console.error('Error deleting project:', err);
      setProjectsError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setProjectSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (!promoteurId) {
      setError('Promoteur ID is missing');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await apiService.updatePromoteur(promoteurId, formData, token);
      router.push('/admin/promoteurs');
    } catch (err) {
      console.error('Error updating promoteur:', err);
      setError(err instanceof Error ? err.message : 'Failed to update promoteur');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Promoteur</h1>
              <p className="mt-2 text-gray-600">
                Update promoteur information
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
                <h3 className="text-sm font-medium text-red-800">Error updating promoteur</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Promoteur Form */}
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
              <p className="mt-1 text-sm text-gray-500">URL-friendly identifier</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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

            {/* Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/promoteurs')}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Projects Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
              <p className="mt-1 text-sm text-gray-600">Manage projects for this promoteur</p>
            </div>
          </div>

          {projectsError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              {projectsError}
            </div>
          )}

          {projectsLoading ? (
            <div className="py-6 text-center text-gray-600">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="py-6 text-center text-gray-600">No projects found for this promoteur.</div>
          ) : (
            <div className="space-y-4 mb-6">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  {editingProjectId === project.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={(editProjectData as any).name || ''}
                            onChange={handleEditProjectChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                          <input
                            type="text"
                            name="slug"
                            value={(editProjectData as any).slug || ''}
                            onChange={handleEditProjectChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="optional"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={(editProjectData as any).description || ''}
                          onChange={handleEditProjectChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                          <select
                            name="wilaya"
                            value={(editProjectData as any).wilaya || ''}
                            onChange={handleEditProjectChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select wilaya</option>
                            {wilayas.map((w) => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Daira</label>
                          <select
                            name="daira"
                            value={(editProjectData as any).daira || ''}
                            onChange={handleEditProjectChange}
                            disabled={!(editProjectData as any).wilaya || editProjectDairas.length === 0}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          >
                            <option value="">Select daira</option>
                            {editProjectDairas.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={(editProjectData as any).address || ''}
                          onChange={handleEditProjectChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={cancelEditProject}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          disabled={projectSaving}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => submitEditProject(project.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          disabled={projectSaving}
                        >
                          {projectSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {(project.daira || project.wilaya) ? `${project.daira || ''}${project.daira && project.wilaya ? ', ' : ''}${project.wilaya || ''}` : 'No location'}
                        </div>
                        {project.slug && (
                          <div className="text-xs text-gray-500 mt-1">Slug: {project.slug}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditProject(project)}
                          className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          disabled={projectSaving}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(project)}
                          className="px-3 py-2 text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                          disabled={projectSaving}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add new project</h3>
            <form onSubmit={submitNewProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={newProjectData.name}
                    onChange={handleNewProjectChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Résidence El Bahia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={newProjectData.slug || ''}
                    onChange={handleNewProjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newProjectData.description || ''}
                  onChange={handleNewProjectChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                  <select
                    name="wilaya"
                    value={newProjectData.wilaya || ''}
                    onChange={handleNewProjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select wilaya</option>
                    {wilayas.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daira</label>
                  <select
                    name="daira"
                    value={newProjectData.daira || ''}
                    onChange={handleNewProjectChange}
                    disabled={!newProjectData.wilaya || newProjectDairas.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select daira</option>
                    {newProjectDairas.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newProjectData.address || ''}
                  onChange={handleNewProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={projectSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {projectSaving ? 'Saving...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
