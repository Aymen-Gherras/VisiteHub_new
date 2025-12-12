'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiService } from '../../../api';
import { ViewsBarChart, DurationLineChart, LocationsDoughnut } from '../components/analytics';

type TopViewed = { propertyId: string; title: string; views: number };
type LongestStayed = { propertyId: string; title: string; avgDurationSeconds: number };
type TopLocation = { wilaya: string; daira: string | null; visits: number };

export default function AdminAnalyticsPage() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topViewed, setTopViewed] = useState<TopViewed[]>([]);
  const [longestStayed, setLongestStayed] = useState<LongestStayed[]>([]);
  const [topLocations, setTopLocations] = useState<TopLocation[]>([]);
  const [range, setRange] = useState<5 | 10 | 20>(10); // Top-N controls

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const [tv, ls, tl] = await Promise.all([
          apiService.getTopViewed(range),
          apiService.getLongestStayed(range),
          apiService.getTopLocations(range),
        ]);
        setTopViewed(tv);
        setLongestStayed(ls);
        setTopLocations(tl);
      } catch (e: any) {
        setError(e?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [range]);

  const locationsData = useMemo(() => topLocations.map((r) => ({
    label: `${r.wilaya}${r.daira ? `, ${r.daira}` : ''}`,
    value: r.visits,
  })), [topLocations]);

  // Derived KPIs/insights
  const totalViews = useMemo(() => topViewed.reduce((a, b) => a + (b.views || 0), 0), [topViewed]);
  const maxAvgDuration = useMemo(() => Math.max(0, ...longestStayed.map(d => d.avgDurationSeconds || 0)), [longestStayed]);
  const bestWilaya = useMemo(() => {
    if (!topLocations.length) return null as null | { label: string; visits: number };
    const top = [...topLocations].sort((a, b) => b.visits - a.visits)[0];
    return { label: `${top.wilaya}${top.daira ? `, ${top.daira}` : ''}` , visits: top.visits };
  }, [topLocations]);

  // Utilities
  const exportCsv = (rows: Array<Record<string, any>>, filename: string) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  const secondsToHms = (s: number) => {
    const sec = Math.max(0, Math.round(s || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const rem = sec % 60;
    return [h, m, rem]
      .map((v) => v.toString().padStart(2, '0'))
      .join(':');
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Traffic et engagement des propriétés</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
              {[5,10,20].map((n) => (
                <button
                  key={n}
                  onClick={() => setRange(n as 5|10|20)}
                  className={`px-3 py-1.5 text-sm rounded-md ${range===n ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                  aria-pressed={range===n}
                >
                  Top {n}
                </button>
              ))}
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-200" />
            <div className="inline-flex gap-2">
              <button
                onClick={() => exportCsv(topViewed.map(v => ({ id: v.propertyId, titre: v.title, vues: v.views })), `top-viewed-top${range}.csv`)}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50"
              >Exporter vues</button>
              <button
                onClick={() => exportCsv(longestStayed.map(v => ({ id: v.propertyId, titre: v.title, duree_moyenne_s: Math.round(v.avgDurationSeconds) })), `longest-stayed-top${range}.csv`)}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50"
              >Exporter durées</button>
              <button
                onClick={() => exportCsv(topLocations.map(v => ({ wilaya: v.wilaya, daira: v.daira ?? '', visites: v.visits })), `top-locations-top${range}.csv`)}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50"
              >Exporter localisations</button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Propriétés vues (Top 10)</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{totalViews}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Éléments suivis</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{topViewed.length + longestStayed.length + topLocations.length}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Entrées (Top locations)</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{topLocations.length}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Durée moyenne max</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{secondsToHms(maxAvgDuration)}</div>
          </div>
        </div>

        {/* Quick insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-sm text-emerald-700">Meilleure localisation</div>
            <div className="mt-1 text-lg font-semibold text-emerald-900">{bestWilaya ? `${bestWilaya.label}` : '—'}</div>
            <div className="text-sm text-emerald-700">{bestWilaya ? `${bestWilaya.visits} visites` : 'Pas de données'}</div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="text-sm text-blue-700">Total vues (Top {range})</div>
            <div className="mt-1 text-lg font-semibold text-blue-900">{totalViews}</div>
            <div className="text-sm text-blue-700">Somme des vues des éléments affichés</div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <div className="text-sm text-purple-700">Durée moyenne max</div>
            <div className="mt-1 text-lg font-semibold text-purple-900">{secondsToHms(maxAvgDuration)}</div>
            <div className="text-sm text-purple-700">Parmi les propriétés affichées</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Vues par propriété</h2>
            </div>
            {topViewed.length ? (
              <ViewsBarChart data={topViewed} />
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">Aucune donnée</div>
            )}
            <div className="mt-4">
              <ul className="divide-y divide-slate-100">
                {topViewed.map((r) => (
                  <li key={r.propertyId} className="py-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{r.title}</div>
                      <div className="text-xs text-slate-500 truncate">{r.propertyId}</div>
                    </div>
                    <div className="text-sm font-semibold text-blue-600">{r.views}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Top localisations</h2>
            </div>
            {locationsData.length ? (
              <LocationsDoughnut data={locationsData} />
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">Aucune donnée</div>
            )}
            <div className="mt-4 space-y-2">
              {topLocations.map((r, i) => (
                <div key={`${r.wilaya}-${r.daira}-${i}`} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 truncate">{r.wilaya}{r.daira ? `, ${r.daira}` : ''}</span>
                  <span className="font-medium text-purple-600">{r.visits}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Durée moyenne par propriété</h2>
            </div>
            {longestStayed.length ? (
              <DurationLineChart data={longestStayed} />
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">Aucune donnée</div>
            )}
            <div className="mt-4">
              <ul className="divide-y divide-slate-100">
                {longestStayed.map((r) => (
                  <li key={r.propertyId} className="py-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{r.title}</div>
                      <div className="text-xs text-slate-500 truncate">{r.propertyId}</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">{secondsToHms(r.avgDurationSeconds)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}