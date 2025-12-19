'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatCard, RecentActivity, QuickActions } from '../components';
import { ViewsBarChart, LocationsDoughnut } from '../components/analytics';
import { apiService, Property } from '../../../api';

type TopViewed = { propertyId: string; title: string; views: number };
type TopLocation = { wilaya: string; daira: string | null; visits: number };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesTotal, setPropertiesTotal] = useState<number>(0);
  const [activeListings, setActiveListings] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [totalAgences, setTotalAgences] = useState<number>(0);
  const [totalPromoteurs, setTotalPromoteurs] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [topViewed, setTopViewed] = useState<TopViewed[]>([]);
  const [topLocations, setTopLocations] = useState<TopLocation[]>([]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [props, viewed, locs, summary] = await Promise.all([
        apiService.getProperties({ limit: 20, sortBy: 'newest' }),
        apiService.getTopViewed(8),
        apiService.getTopLocations(5),
        apiService.getAdminDashboardSummary(),
      ]);
      setProperties(props.properties);
      setPropertiesTotal(summary.totalProperties ?? props.total ?? props.properties.length);
      setActiveListings(summary.activeListings ?? summary.totalProperties ?? 0);
      setTotalValue(summary.totalValueDzd ?? 0);
      setTotalVisits(summary.totalVisits ?? 0);
      setTotalAgences(summary.totalAgences ?? 0);
      setTotalPromoteurs(summary.totalPromoteurs ?? 0);
      setTotalProjects(summary.totalProjects ?? 0);
      setTopViewed(viewed);
      setTopLocations(locs);
    } catch (e: any) {
      setError(e?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    const onFocus = () => {
      loadDashboard();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadDashboard();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [loadDashboard]);

  const totalProperties = propertiesTotal;
  const totalViews = totalVisits;

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
        <StatCard title="Total Value" value={`${Math.round(totalValue).toLocaleString('ar-DZ')} DZD`} change="" icon="💰" />
        <StatCard title="Agences" value={totalAgences} change="" icon="🏢" />
        <StatCard title="Promoteurs" value={totalPromoteurs} change="" icon="🏗️" />
        <StatCard title="Projects" value={totalProjects} change="" icon="🧩" />
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