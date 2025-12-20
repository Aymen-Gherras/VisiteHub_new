'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { apiService } from '../../../api';

// Algerian wilayas data
const initialWilayas: string[] = [];

const propertyTypes = ['apartment', 'house', 'villa', 'land', 'commercial'];

const propertyTypeLabels: Record<string, string> = {
  apartment: 'Appartement',
  house: 'Maison',
  villa: 'Villa',
  land: 'Terrain',
  commercial: 'Commercial'
};

const ownerTypes = [
  { value: 'Particulier', label: 'Particulier' },
];

interface FilterState {
  searchQuery: string;
  transactionType: 'tous' | 'vendre' | 'location';
  selectedWilaya: string;
  selectedDaira?: string;
  selectedPropertyType: string;
  selectedPropertyOwnerType: string;
  selectedPaymentConditions: string[];
  selectedSpecifications: string[];
  selectedPapers: string[];
}

interface AdvancedFilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  showOwnerTypeSelect?: boolean;
}

export const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({
  filters,
  onFiltersChange,
  className = '',
  showOwnerTypeSelect = true
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [wilayas, setWilayas] = useState<string[]>(initialWilayas);
  const [availableDairas, setAvailableDairas] = useState<string[]>([]);
  const [dairasLoading, setDairasLoading] = useState(false);

  // Popover & search states
  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [dairaOpen, setDairaOpen] = useState(false);
  const [wilayaQuery, setWilayaQuery] = useState('');
  const [dairaQuery, setDairaQuery] = useState('');
  
  const wilayaBtnRef = useRef<HTMLButtonElement | null>(null);
  const dairaBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let mounted = true;
    apiService.listWilayas()
      .then((w) => {
        if (!mounted) return;
        const sorted = [...w].sort((a, b) => a.localeCompare(b, 'fr'));
        setWilayas(sorted);
        if (filters.selectedWilaya) {
          setDairasLoading(true);
          apiService.listDairas(filters.selectedWilaya).then((d) => {
            if (!mounted) return;
            setAvailableDairas(d || []);
          }).catch(() => {}).finally(() => { if (mounted) setDairasLoading(false); });
        }
      })
      .catch(() => {
        // ignore
      });
    return () => { mounted = false; };
  }, []);

  // Keep dairas in sync when wilaya changes from parent or locally
  useEffect(() => {
    if (!filters.selectedWilaya) {
      setAvailableDairas([]);
      return;
    }
    let cancelled = false;
    setDairasLoading(true);
    apiService.listDairas(filters.selectedWilaya)
      .then((d) => { if (!cancelled) setAvailableDairas(d || []); })
      .catch(() => { if (!cancelled) setAvailableDairas([]); })
      .finally(() => { if (!cancelled) setDairasLoading(false); });
    return () => { cancelled = true; };
  }, [filters.selectedWilaya]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleWilayaChange = (wilaya: string) => {
    // Update both wilaya and clear daira in a single state update to ensure proper filtering
    onFiltersChange({ 
      ...filters, 
      selectedWilaya: wilaya,
      selectedDaira: '' 
    });
    setDairasLoading(true);
    apiService.listDairas(wilaya).then((d) => {
      setAvailableDairas(d || []);
    }).catch(() => setAvailableDairas([])).finally(() => setDairasLoading(false));
  };

  const clearWilaya = () => {
    // Update both wilaya and daira in a single state update
    onFiltersChange({ 
      ...filters, 
      selectedWilaya: '',
      selectedDaira: '' 
    });
    setAvailableDairas([]);
    setWilayaQuery('');
    setDairaQuery('');
  };

  const clearDaira = () => {
    updateFilter('selectedDaira', '');
    setDairaQuery('');
  };

  const resetAllFilters = () => {
    // Reset parent filters in a single update
    onFiltersChange({
      searchQuery: '',
      transactionType: 'tous',
      selectedWilaya: '',
      selectedDaira: '',
      selectedPropertyType: '',
      selectedPropertyOwnerType: '',
      selectedPaymentConditions: [],
      selectedSpecifications: [],
      selectedPapers: [],
    });
    // Reset local UI state
    setAvailableDairas([]);
    setWilayaQuery('');
    setDairaQuery('');
    setWilayaOpen(false);
    setDairaOpen(false);
  };

  // Filtered lists
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

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {/* Top row */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3">
        {/* Transaction */}
        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tx"
              checked={filters.transactionType === 'vendre'}
              onChange={() => updateFilter('transactionType', 'vendre')}
              className="text-gray-900 focus:ring-gray-800"
            />
            <span className="font-medium">Acheter</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tx"
              checked={filters.transactionType === 'location'}
              onChange={() => updateFilter('transactionType', 'location')}
              className="text-gray-900 focus:ring-gray-800"
            />
            <span className="font-medium">Louer</span>
          </label>
        </div>

        {/* Keyword search */}
        <div className="flex-1 relative">
          <i className="fas fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Rechercher par mot-clé"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
          />
        </div>

        {/* Settings toggle */}
        <button
          onClick={() => setShowPanel(v => !v)}
          className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 inline-flex items-center justify-center"
          aria-expanded={showPanel}
          aria-controls="filters-panel"
          aria-label="Filtres"
        >
          <i className="fas fa-sliders"></i>
        </button>

        {/* Primary search */}
        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-semibold">
          Recherche
        </button>
      </div>

      {/* Settings panel: ONLY the three selects, like your screenshot */}
      {showPanel && (
        <div
          id="filters-panel"
          className="mt-6 border-t pt-6"
        >
          <div className="flex items-center justify-end mb-4">
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Property Owner Type - FIRST */}
            {showOwnerTypeSelect && (
              <div>
                <label className="sr-only">Propriétaire</label>
                <select
                  value={filters.selectedPropertyOwnerType}
                  onChange={(e) => updateFilter('selectedPropertyOwnerType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                >
                  {ownerTypes.map(ownerType => (
                    <option key={ownerType.value} value={ownerType.value}>{ownerType.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Wilaya - searchable popover */}
            <div className="relative">
              <label className="sr-only">Wilaya</label>
              <button
                ref={wilayaBtnRef}
                type="button"
                onClick={() => setWilayaOpen((v) => !v)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white text-left flex items-center justify-between"
                aria-haspopup="listbox"
                aria-expanded={wilayaOpen}
              >
                <span className="truncate">
                  {filters.selectedWilaya ? `Wilaya: ${filters.selectedWilaya}` : 'Sélectionner une wilaya'}
                </span>
                <span className="flex items-center gap-2">
                  {filters.selectedWilaya && (
                    <span onClick={(e) => { e.stopPropagation(); clearWilaya(); }} className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200" aria-label="Effacer">
                      ×
                    </span>
                  )}
                  <i className={`fas fa-chevron-down transition-transform ${wilayaOpen ? 'rotate-180' : ''}`}></i>
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
                  <ul role="listbox" className="max-h-60 overflow-auto py-1">
                    <li
                      role="option"
                      aria-selected={false}
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
                        role="option"
                        aria-selected={filters.selectedWilaya === w}
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

            {/* Daira - searchable popover */}
            <div className="relative">
              <label className="sr-only">Daira</label>
              <button
                ref={dairaBtnRef}
                type="button"
                onClick={() => !dairasLoading && availableDairas.length > 0 && setDairaOpen((v) => !v)}
                disabled={availableDairas.length === 0}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white text-left flex items-center justify-between disabled:bg-gray-100"
                aria-haspopup="listbox"
                aria-expanded={dairaOpen}
              >
                <span className="truncate">
                  {filters.selectedDaira ? `Daira: ${filters.selectedDaira}` : (dairasLoading ? 'Chargement des dairas...' : (availableDairas.length > 0 ? 'Sélectionner une daira' : 'Choisissez une wilaya'))}
                </span>
                <span className="flex items-center gap-2">
                  {filters.selectedDaira && (
                    <span onClick={(e) => { e.stopPropagation(); clearDaira(); }} className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200" aria-label="Effacer">
                      ×
                    </span>
                  )}
                  {dairasLoading ? (
                    <span className="inline-block h-4 w-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
                  ) : (
                    <i className={`fas fa-chevron-down transition-transform ${dairaOpen ? 'rotate-180' : ''}`}></i>
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
                  <ul role="listbox" className="max-h-60 overflow-auto py-1">
                    <li
                      role="option"
                      aria-selected={false}
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
                        role="option"
                        aria-selected={filters.selectedDaira === d}
                        onClick={() => { updateFilter('selectedDaira', d); setDairaOpen(false); }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="sr-only">Type</label>
              <select
                value={filters.selectedPropertyType}
                onChange={(e) => updateFilter('selectedPropertyType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
              >
                <option value="">Pièces / Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{propertyTypeLabels[type]}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
