'use client';

import React, { useEffect, useState } from 'react';
import { apiService, Demande, DemandeStatus, DemandeAnalyticsSummary } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';

export default function DemandeTable() {
  const { token } = useAuth();
  const [items, setItems] = useState<Demande[]>([]);
  const [analytics, setAnalytics] = useState<DemandeAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const refresh = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [list, summary] = await Promise.all([
        apiService.listDemandes(token),
        apiService.getDemandeAnalytics(token),
      ]);
      setItems(list);
      setAnalytics(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [token]);

  const setStatus = async (id: string, status: DemandeStatus) => {
    if (!token) return;
    try {
      setWorkingId(id);
      // Optimistic update
      setItems((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
      setAnalytics((prev) => {
        if (!prev) return prev;
        const old = items.find((c) => c.id === id);
        if (!old || old.status === status) return prev;
        const delta: any = { ...prev };
        delta[old.status] = Math.max(0, (delta as any)[old.status] - 1);
        delta[status] = ((delta as any)[status] || 0) + 1;
        return { ...prev, ...delta };
      });
      await apiService.updateDemandeStatus(id, status, token);
    } catch (e) {
      await refresh(); // revert by reloading
    } finally {
      setWorkingId(null);
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    if (!confirm('Supprimer cette demande ?')) return;
    try {
      setWorkingId(id);
      // Optimistic update of list and analytics
      setItems((prev) => prev.filter((c) => c.id !== id));
      setAnalytics((prev) => {
        if (!prev) return prev;
        const removed = items.find((c) => c.id === id);
        if (!removed) return prev;
        return {
          ...prev,
          total: Math.max(0, prev.total - 1),
          pending: removed.status === 'pending' ? Math.max(0, prev.pending - 1) : prev.pending,
          processed: removed.status === 'processed' ? Math.max(0, prev.processed - 1) : prev.processed,
          rejected: removed.status === 'rejected' ? Math.max(0, prev.rejected - 1) : prev.rejected,
        };
      });
      await apiService.deleteDemande(id, token);
    } catch (e) {
      await refresh(); // reload to ensure consistency
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Demandes de propriété</h1>
        <button
          onClick={refresh}
          className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200"
        >
          Rafraîchir
        </button>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: analytics.total },
            { label: 'En attente', value: analytics.pending },
            { label: 'Traitées', value: analytics.processed },
            { label: 'Rejetées', value: analytics.rejected },
            { label: '7 derniers jours', value: analytics.last7Days },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white rounded shadow">
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="text-xl font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Intention</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-4 py-8 text-center" colSpan={9}>Chargement…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-4 py-8 text-center" colSpan={9}>Aucune demande</td></tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone || '-'}</td>
                  <td className="px-4 py-3 capitalize">{c.propertyType}</td>
                  <td className="px-4 py-3">{c.propertyLocation}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.propertyIntention === 'sell' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {c.propertyIntention === 'sell' ? 'Vendre' : 'Louer'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.images && c.images.length > 0 ? (
                      <div className="flex space-x-1">
                        {c.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-8 h-8 object-cover rounded"
                            title="Cliquez pour agrandir"
                            onClick={() => window.open(image, '_blank')}
                          />
                        ))}
                        {c.images.length > 3 && (
                          <span className="text-xs text-gray-500">+{c.images.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Aucune</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      c.status === 'processed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button disabled={workingId===c.id} className="text-emerald-600 hover:underline disabled:opacity-50" onClick={() => setStatus(c.id, DemandeStatus.PROCESSED)}>Marquer traité</button>
                    <button disabled={workingId===c.id} className="text-amber-600 hover:underline disabled:opacity-50" onClick={() => setStatus(c.id, DemandeStatus.PENDING)}>En attente</button>
                    <button disabled={workingId===c.id} className="text-red-600 hover:underline disabled:opacity-50" onClick={() => remove(c.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


