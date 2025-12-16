'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService } from '../../api';

interface Promoteur {
  id: string;
  name: string;
  slug: string;
  wilaya: string;
  daira?: string;
  description?: string;
  logo?: string;
  projectsCount: number;
  initials: string;
  bgColor: string;
}

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

// Mock data - This will be replaced with API call from admin panel
// TODO: Connect to backend API endpoint: GET /api/promoteurs
const mockPromoteurs: Promoteur[] = [
  {
    id: '1',
    name: 'Bessa Promotion',
    slug: 'bessa-promotion',
    wilaya: '16 - Alger',
    daira: 'Alger',
    description: 'Leader de la promotion immobilière, nous construisons l\'avenir avec des résidences haut...',
    projectsCount: 12,
    initials: 'BE',
    bgColor: 'bg-gray-700'
  },
  {
    id: '2',
    name: 'Hasnaoui Immobilier',
    slug: 'hasnaoui-immobilier',
    wilaya: '31 - Oran',
    daira: 'Oran',
    description: 'Une expertise reconnue dans la construction de cités intégrées et d\'espaces durables...',
    projectsCount: 8,
    initials: 'HA',
    bgColor: 'bg-teal-500'
  },
  {
    id: '3',
    name: 'Goumid Promotion',
    slug: 'goumid-promotion',
    wilaya: '25 - Constantine',
    daira: 'Constantine',
    description: 'Votre partenaire de confiance pour des logements de qualité supérieure au cœur de la ville...',
    projectsCount: 5,
    initials: 'GO',
    bgColor: 'bg-gray-700'
  }
];

export default function PromoteursPage() {
  const [promoteurs, setPromoteurs] = useState<Promoteur[]>(mockPromoteurs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedDaira, setSelectedDaira] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [availableDairas, setAvailableDairas] = useState<string[]>([]);
  const [dairasLoading, setDairasLoading] = useState(false);
  
  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [dairaOpen, setDairaOpen] = useState(false);
  const [wilayaQuery, setWilayaQuery] = useState('');
  const [dairaQuery, setDairaQuery] = useState('');
  
  const wilayaBtnRef = useRef<HTMLButtonElement | null>(null);
  const dairaBtnRef = useRef<HTMLButtonElement | null>(null);

  // Load wilayas
  useEffect(() => {
    let mounted = true;
    apiService.listWilayas()
      .then((w) => {
        if (!mounted) return;
        setWilayas(w);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Load dairas when wilaya changes
  useEffect(() => {
    if (!selectedWilaya) {
      setAvailableDairas([]);
      return;
    }
    let cancelled = false;
    setDairasLoading(true);
    apiService.listDairas(selectedWilaya)
      .then((d) => { if (!cancelled) setAvailableDairas(d || []); })
      .catch(() => { if (!cancelled) setAvailableDairas([]); })
      .finally(() => { if (!cancelled) setDairasLoading(false); });
    return () => { cancelled = true; };
  }, [selectedWilaya]);

  // Filter promoteurs
  const filteredPromoteurs = useMemo(() => {
    return promoteurs.filter((p) => {
      const matchesSearch = !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.wilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesWilaya = !selectedWilaya || p.wilaya === selectedWilaya;
      const matchesDaira = !selectedDaira || p.daira === selectedDaira;
      
      return matchesSearch && matchesWilaya && matchesDaira;
    });
  }, [promoteurs, searchQuery, selectedWilaya, selectedDaira]);

  const handleWilayaChange = (wilaya: string) => {
    setSelectedWilaya(wilaya);
    setSelectedDaira('');
    setDairasLoading(true);
    apiService.listDairas(wilaya).then((d) => {
      setAvailableDairas(d || []);
    }).catch(() => setAvailableDairas([])).finally(() => setDairasLoading(false));
  };

  const clearWilaya = () => {
    setSelectedWilaya('');
    setSelectedDaira('');
    setAvailableDairas([]);
    setWilayaQuery('');
    setDairaQuery('');
  };

  const clearDaira = () => {
    setSelectedDaira('');
    setDairaQuery('');
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedWilaya('');
    setSelectedDaira('');
    setAvailableDairas([]);
    setWilayaQuery('');
    setDairaQuery('');
    setWilayaOpen(false);
    setDairaOpen(false);
  };

  const filteredWilayas = useMemo(() => {
    const q = wilayaQuery.trim().toLowerCase();
    if (!q) return wilayas;
    return wilayas.filter(w => w.toLowerCase().includes(q));
  }, [wilayas, wilayaQuery]);

  const filteredDairas = useMemo(() => {
    const q = dairaQuery.trim().toLowerCase();
    if (!q) return availableDairas;
    return availableDairas.filter(d => d.toLowerCase().includes(q));
  }, [availableDairas, dairaQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des promoteurs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos <span className="text-teal-600">Promoteurs</span> Partenaires
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les projets des meilleurs promoteurs immobiliers de la région.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row items-stretch gap-3">
              {/* Keyword search */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par mot-clé"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                />
              </div>

              {/* Settings toggle */}
              <button
                onClick={() => setShowFilters(v => !v)}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 inline-flex items-center justify-center"
                aria-label="Filtres"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>

              {/* Primary search */}
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-semibold">
                Recherche
              </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-end mb-4">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Wilaya */}
                  <div className="relative">
                    <button
                      ref={wilayaBtnRef}
                      type="button"
                      onClick={() => setWilayaOpen((v) => !v)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white text-left flex items-center justify-between"
                    >
                      <span className="truncate">
                        {selectedWilaya ? `Wilaya: ${selectedWilaya}` : 'Sélectionner une wilaya'}
                      </span>
                      <span className="flex items-center gap-2">
                        {selectedWilaya && (
                          <span onClick={(e) => { e.stopPropagation(); clearWilaya(); }} className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                            ×
                          </span>
                        )}
                        <svg className={`w-4 h-4 transition-transform ${wilayaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {wilayaOpen && (
                      <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                        <div className="p-2 border-b">
                          <input
                            autoFocus
                            value={wilayaQuery}
                            onChange={(e) => setWilayaQuery(e.target.value)}
                            placeholder="Rechercher wilaya..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                          />
                        </div>
                        <ul className="max-h-60 overflow-auto py-1">
                          <li
                            onClick={() => { clearWilaya(); setWilayaOpen(false); }}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 text-gray-700"
                          >
                            Voir toutes les wilayas
                          </li>
                          {filteredWilayas.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-500">Aucun résultat</li>
                          )}
                          {filteredWilayas.map((w) => (
                            <li
                              key={w}
                              onClick={() => { handleWilayaChange(w); setWilayaOpen(false); }}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                            >
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Daira */}
                  <div className="relative">
                    <button
                      ref={dairaBtnRef}
                      type="button"
                      onClick={() => !dairasLoading && availableDairas.length > 0 && setDairaOpen((v) => !v)}
                      disabled={availableDairas.length === 0}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white text-left flex items-center justify-between disabled:bg-gray-100"
                    >
                      <span className="truncate">
                        {selectedDaira ? `Daira: ${selectedDaira}` : (dairasLoading ? 'Chargement des dairas...' : (availableDairas.length > 0 ? 'Sélectionner une daira' : 'Choisissez une wilaya'))}
                      </span>
                      <span className="flex items-center gap-2">
                        {selectedDaira && (
                          <span onClick={(e) => { e.stopPropagation(); clearDaira(); }} className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                            ×
                          </span>
                        )}
                        {dairasLoading ? (
                          <span className="inline-block h-4 w-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
                        ) : (
                          <svg className={`w-4 h-4 transition-transform ${dairaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </span>
                    </button>
                    {dairaOpen && (
                      <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                        <div className="p-2 border-b">
                          <input
                            autoFocus
                            value={dairaQuery}
                            onChange={(e) => setDairaQuery(e.target.value)}
                            placeholder="Rechercher daira..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                          />
                        </div>
                        <ul className="max-h-60 overflow-auto py-1">
                          <li
                            onClick={() => { clearDaira(); setDairaOpen(false); }}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 text-gray-700"
                          >
                            Voir toutes les dairas
                          </li>
                          {filteredDairas.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-500">Aucun résultat</li>
                          )}
                          {filteredDairas.map((d) => (
                            <li
                              key={d}
                              onClick={() => { setSelectedDaira(d); setDairaOpen(false); }}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                            >
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promoteurs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPromoteurs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun résultat trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromoteurs.map((promoteur) => (
              <Link
                key={promoteur.id}
                href={`/promoteurs/${promoteur.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                {/* Cover Image with Initials */}
                <div className={`relative h-48 ${promoteur.bgColor} flex items-center justify-center`}>
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20">
                    <span className="text-4xl font-bold text-white">{promoteur.initials}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {promoteur.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {promoteur.daira ? `${promoteur.daira}, ${promoteur.wilaya}` : promoteur.wilaya}
                  </div>

                  {/* Description */}
                  {promoteur.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{promoteur.description}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-teal-600 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {promoteur.projectsCount} Projets
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Voir profil
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold">Visite</span>
                <span className="text-2xl font-bold text-teal-500">Hub</span>
              </div>
              <p className="text-gray-400 text-sm">
                La première plateforme de visites virtuelles en Algérie. Découvrez votre futur logement
                vous sans vous déplacer.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">LIENS RAPIDES</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/properties" className="hover:text-teal-500 transition-colors">
                    Acheter
                  </Link>
                </li>
                <li>
                  <Link href="/properties?type=location" className="hover:text-teal-500 transition-colors">
                    Louer
                  </Link>
                </li>
                <li>
                  <Link href="/promoteurs" className="hover:text-teal-500 transition-colors">
                    Promoteurs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">CONTACT</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>contact@visitehub.dz</li>
                <li>+213 550 00 00 00</li>
                <li>Alger, Algérie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
