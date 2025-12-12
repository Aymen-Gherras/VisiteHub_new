'use client';

import { useEffect, useMemo, useState } from 'react';
import { StatCard, RecentActivity, QuickActions } from '../components';
import { ViewsBarChart, LocationsDoughnut } from '../components/analytics';
import { apiService, Property } from '../../../api';

type TopViewed = { propertyId: string; title: string; views: number };
type TopLocation = { wilaya: string; daira: string | null; visits: number };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [topViewed, setTopViewed] = useState<TopViewed[]>([]);
  const [topLocations, setTopLocations] = useState<TopLocation[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const [props, viewed, locs] = await Promise.all([
          apiService.getProperties({ limit: 20 }),
          apiService.getTopViewed(8),
          apiService.getTopLocations(5),
        ]);
        setProperties(props.properties);
        setTopViewed(viewed);
        setTopLocations(locs);
      } catch (e: any) {
        setError(e?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const totalProperties = properties.length;
  const activeListings = totalProperties; // adjust if you have status
  const totalViews = useMemo(() => topViewed.reduce((a, b) => a + (b.views || 0), 0), [topViewed]);
  const revenue = useMemo(() => properties.reduce((sum, p) => {
    const price = typeof p.price === 'string' ? parseFloat(p.price) || 0 : (p.price || 0);
    return sum + price;
  }, 0), [properties]);

  const locationsData = useMemo(() => topLocations.map((r) => ({
    label: `${r.wilaya}${r.daira ? `, ${r.daira}` : ''}`,
    value: r.visits,
  })), [topLocations]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Aperçu rapide des performances</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Properties" value={totalProperties} change="" icon="🏠" />
        <StatCard title="Active Listings" value={activeListings} change="" icon="📋" />
        <StatCard title="Total Views" value={totalViews.toLocaleString()} change="" icon="👁️" />
        <StatCard title="Total Value" value={`${Math.round(revenue).toLocaleString('ar-DZ')} DZD`} change="" icon="💰" />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Vues par propriété</h2>
          </div>
          {topViewed.length ? (
            <div className="h-72"><ViewsBarChart data={topViewed} /></div>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">Aucune donnée</div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Top localisations</h2>
          </div>
          {locationsData.length ? (
            <div className="h-72"><LocationsDoughnut data={locationsData} /></div>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">Aucune donnée</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Dernières propriétés</h2>
          <ul className="divide-y divide-slate-100">
            {properties.slice(0, 8).map((p) => (
              <li key={p.id} className="py-2 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{p.title}</div>
                  <div className="text-xs text-slate-500 truncate">{p.wilaya}{p.daira ? `, ${p.daira}` : ''}</div>
                </div>
                <div className="text-sm font-semibold text-slate-700">{Math.round(typeof p.price === 'string' ? parseFloat(p.price) || 0 : (p.price || 0)).toLocaleString('ar-DZ')} DZD</div>
              </li>
            ))}
            {properties.length === 0 && (
              <li className="py-6 text-center text-slate-500">Aucune propriété</li>
            )}
          </ul>
        </div>
        <RecentActivity properties={properties.slice(0, 8)} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}