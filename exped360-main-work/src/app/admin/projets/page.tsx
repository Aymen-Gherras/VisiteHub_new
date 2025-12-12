'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, Project } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

export default function AdminProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!token) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${project.name}" ?`)) {
      return;
    }

    try {
      await apiService.deleteProject(project.id, token);
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { color: 'bg-yellow-100 text-yellow-800', label: 'Planification', icon: '📋' },
      construction: { color: 'bg-blue-100 text-blue-800', label: 'En construction', icon: '🏗️' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Terminé', icon: '✅' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspendu', icon: '⏸️' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Projets</h1>
          <p className="text-gray-600">Gérez les projets de développement immobilier</p>
        </div>
        <Link
          href="/admin/projets/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nouveau Projet
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Projets ({projects.length})
          </h3>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏘️</div>
            <p className="text-gray-500 text-lg mb-2">Aucun projet trouvé</p>
            <p className="text-gray-400 mb-4">Commencez par créer votre premier projet</p>
            <Link
              href="/admin/projets/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Créer un projet
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avancement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriétés
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage}
                            alt={`Image ${project.name}`}
                            className="h-10 w-16 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-16 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 text-lg">🏘️</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.promoteur?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.wilaya && project.daira ? `${project.daira}, ${project.wilaya}` : project.wilaya || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.completionPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {project.completionPercentage || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.properties?.length || 0} propriété(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/projets/edit/${project.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(project)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                        <a
                          href={`/projets/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          Voir
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}