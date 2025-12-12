'use client';

import { useState, useEffect } from 'react';
import { apiService, Paper, CreatePaperDto } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

export default function PapersPage() {
  const { token } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState<CreatePaperDto>({ name: '' });

  useEffect(() => {
    if (token) {
      fetchPapers();
    }
  }, [token]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const papersData = await apiService.getPapers();
      setPapers(papersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch papers');
      console.error('Error fetching papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const newPaper = await apiService.createPaper(formData, token);
      setPapers([...papers, newPaper]);
      setFormData({ name: '' });
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create paper');
      console.error('Error creating paper:', err);
    }
  };

  const handleUpdatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingPaper) return;

    try {
      const updatedPaper = await apiService.updatePaper(editingPaper.id, formData, token);
      setPapers(papers.map(p => p.id === editingPaper.id ? updatedPaper : p));
      setFormData({ name: '' });
      setEditingPaper(null);
      setError(null);
    } catch (err) {
      setError('Failed to update paper');
      console.error('Error updating paper:', err);
    }
  };

  const handleDeletePaper = async (id: string) => {
    if (!token) return;

    if (!confirm('Are you sure you want to delete this paper?')) return;

    try {
      await apiService.deletePaper(id, token);
      setPapers(papers.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete paper');
      console.error('Error deleting paper:', err);
    }
  };

  const handleSeedPapers = async () => {
    if (!token) return;

    try {
      await apiService.seedPapers(token);
      await fetchPapers();
      setError(null);
    } catch (err) {
      setError('Failed to seed papers');
      console.error('Error seeding papers:', err);
    }
  };

  const startEdit = (paper: Paper) => {
    setEditingPaper(paper);
    setFormData({ name: paper.name });
  };

  const cancelEdit = () => {
    setEditingPaper(null);
    setFormData({ name: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Papers Management</h1>
          <p className="mt-2 text-gray-600">Manage legal documents available for properties</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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

        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Paper
          </button>
          <button
            onClick={handleSeedPapers}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Seed Default Papers
          </button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingPaper) && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPaper ? 'Edit Paper' : 'Create New Paper'}
            </h2>
            <form onSubmit={editingPaper ? handleUpdatePaper : handleCreatePaper} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Paper Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter paper name"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPaper ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={editingPaper ? cancelEdit : () => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Papers List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Available Papers</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {papers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No papers available. Create some papers or seed the default ones.
              </div>
            ) : (
              papers.map((paper) => (
                <div key={paper.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{paper.name}</h4>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(paper.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(paper)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePaper(paper.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
