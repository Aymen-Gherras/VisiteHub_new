'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectStatus, PropertyOwner } from '../../../api/types';
import { apiService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectFilters from '../components/projects/ProjectFilters';

export default function AdminProjects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [promoteurs, setPromoteurs] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [filterPromoteur, setFilterPromoteur] = useState<string>('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsData, promoteursData] = await Promise.all([
        apiService.getProjects(),
        apiService.getPromoteurs()
      ]);
      
      // Apply filters
      let filteredProjects = projectsData;
      
      if (filterStatus !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.status === filterStatus);
      }
      
      if (filterPromoteur !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.propertyOwner.id === filterPromoteur);
      }
      
      if (searchTerm) {
        filteredProjects = filteredProjects.filter(project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.propertyOwner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.wilaya?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setProjects(filteredProjects);
      setPromoteurs(promoteursData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, filterPromoteur, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await apiService.deleteProject(id, token);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const stats = {
    total: projects.length,
    planning: projects.filter(p => p.status === ProjectStatus.PLANNING).length,
    construction: projects.filter(p => p.status === ProjectStatus.CONSTRUCTION).length,
    completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage promoteur projects</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/projects/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Project
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4a2 2 0 002 2h2a2 2 0 002-2v-4m0 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Planning</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.planning}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Construction</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.construction}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProjectFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filterPromoteur={filterPromoteur}
        promoteurs={promoteurs}
        filteredCount={projects.length}
        onSearchChange={setSearchTerm}
        onStatusChange={setFilterStatus}
        onPromoteurChange={setFilterPromoteur}
      />

      {/* Error State */}
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Projects Table */}
      {!loading && !error && (
        <ProjectTable
          projects={projects}
          onDelete={handleDelete}
        />
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <Link
              href="/admin/projects/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
