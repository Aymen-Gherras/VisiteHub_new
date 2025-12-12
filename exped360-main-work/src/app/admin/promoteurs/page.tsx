'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

interface Promoteur {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  email?: string;
  wilaya?: string;
  daira?: string;
  foundedYear?: number;
  stats: {
    totalProjects: number;
    totalProperties: number;
    completedProjects: number;
    ongoingProjects: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface CreatePromoteurData {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  foundedYear?: number;
}

export default function AdminPromoteursPage() {
  const { token } = useAuth();
  const [promoteurs, setPromoteurs] = useState<Promoteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPromoteur, setEditingPromoteur] = useState<Promoteur | null>(null);
  const [formData, setFormData] = useState<CreatePromoteurData>({
    name: '',
    description: '',
    logo: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    wilaya: '',
    daira: '',
    foundedYear: undefined,
  });

  useEffect(() => {
    loadPromoteurs();
  }, []);

  const loadPromoteurs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/admin/promoteurs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setPromoteurs(data.data);
      } else {
        setError(data.message || 'Failed to load promoteurs');
      }
    } catch (error) {
      console.error('Error loading promoteurs:', error);
      setError('Failed to load promoteurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/admin/promoteurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await loadPromoteurs();
        setShowCreateForm(false);
        resetForm();
      } else {
        setError(data.message || 'Failed to create promoteur');
      }
    } catch (error) {
      console.error('Error creating promoteur:', error);
      setError('Failed to create promoteur');
    }
  };

  const handleUpdate = async () => {
    if (!editingPromoteur) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/admin/promoteurs/${editingPromoteur.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await loadPromoteurs();
        setEditingPromoteur(null);
        resetForm();
      } else {
        setError(data.message || 'Failed to update promoteur');
      }
    } catch (error) {
      console.error('Error updating promoteur:', error);
      setError('Failed to update promoteur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce promoteur ?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/admin/promoteurs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadPromoteurs();
      } else {
        setError('Failed to delete promoteur');
      }
    } catch (error) {
      console.error('Error deleting promoteur:', error);
      setError('Failed to delete promoteur');
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/admin/promoteurs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        await loadPromoteurs();
      }
    } catch (error) {
      console.error('Error updating promoteur status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: '',
      website: '',
      phone: '',
      email: '',
      address: '',
      wilaya: '',
      daira: '',
      foundedYear: undefined,
    });
  };

  const startEdit = (promoteur: Promoteur) => {
    setEditingPromoteur(promoteur);
    setFormData({
      name: promoteur.name,
      description: promoteur.description || '',
      logo: promoteur.logo || '',
      website: promoteur.website || '',
      phone: promoteur.phone || '',
      email: promoteur.email || '',
      address: '',
      wilaya: promoteur.wilaya || '',
      daira: promoteur.daira || '',
      foundedYear: promoteur.foundedYear || undefined,
    });
  };

  const filteredPromoteurs = promoteurs.filter(promoteur =>
    promoteur.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const wilayas = ['Alger', 'Oran', 'Constantine', 'Béjaïa', 'Tizi Ouzou', 'Sétif', 'Annaba'];

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Promoteurs</h1>
          <p className="text-gray-600">Gérez les promoteurs immobiliers et leurs projets</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadPromoteurs}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouveau Promoteur
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher un promoteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredPromoteurs.length} promoteur(s) trouvé(s)
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {(showCreateForm || editingPromoteur) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingPromoteur ? 'Modifier le Promoteur' : 'Nouveau Promoteur'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wilaya
              </label>
              <select
                value={formData.wilaya}
                onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une wilaya</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya} value={wilaya}>
                    {wilaya}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Web
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année de fondation
              </label>
              <input
                type="number"
                value={formData.foundedYear || ''}
                onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingPromoteur(null);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={editingPromoteur ? handleUpdate : handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingPromoteur ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </div>
      )}

      {/* Promoteurs List */}
      {filteredPromoteurs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v6.5M7 7h3v3H7V7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun promoteur</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer un nouveau promoteur.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredPromoteurs.map((promoteur) => (
              <li key={promoteur.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {promoteur.logo ? (
                        <img
                          src={promoteur.logo}
                          alt={promoteur.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 font-bold text-lg">
                            {promoteur.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {promoteur.name}
                        </h3>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          promoteur.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {promoteur.isActive ? 'Actif' : 'Inactif'}
                        </span>
                        {promoteur.isFeatured && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Vedette
                          </span>
                        )}
                      </div>
                      {promoteur.description && (
                        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                          {promoteur.description.substring(0, 100)}...
                        </p>
                      )}
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        {promoteur.wilaya && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {promoteur.wilaya}
                          </span>
                        )}
                        <span>{promoteur.stats.totalProjects} projets</span>
                        <span>{promoteur.stats.totalProperties} propriétés</span>
                        {promoteur.website && (
                          <a
                            href={promoteur.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Site web
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <a
                      href={`/promoteurs/${promoteur.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Voir
                    </a>
                    <button
                      onClick={() => startEdit(promoteur)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => toggleStatus(promoteur.id, promoteur.isActive)}
                      className={`text-sm font-medium ${
                        promoteur.isActive 
                          ? 'text-red-600 hover:text-red-800' 
                          : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {promoteur.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDelete(promoteur.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
