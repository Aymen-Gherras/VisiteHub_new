'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';

interface CarouselItem {
  id: string;
  imageUrl: string;
  altText?: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
}

export default function AdminHomepageSettings() {
  const { token } = useAuth();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxSlides, setMaxSlides] = useState<number>(3);
  const [maxFeatured, setMaxFeatured] = useState<number>(6);

  // Featured management state
  const [featured, setFeatured] = useState<Array<{ property: any; position: number }>>([]);
  const [addingSlugOrId, setAddingSlugOrId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        if (!token) return;
        setLoading(true);
        const s = await apiService.getHomepageSettings(token);
        setMaxSlides(s.maxSlides || 3);
        setMaxFeatured(s.maxFeatured || 6);
        const data = await apiService.listCarousel(true, token);
        setItems(data as any);
        const f = await apiService.adminListFeatured(token);
        setFeatured(f as any);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const activeCount = items.filter(i => i.isActive).length;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!token) return;
      const file = e.target.files?.[0];
      if (!file) return;
      const { imageUrl } = await apiService.uploadCarouselImage(file, token);
      const created = await apiService.createCarouselItem({ imageUrl, isActive: activeCount < maxSlides }, token);
      setItems(prev => [...prev, created]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      e.target.value = '';
    }
  };

  const updateItem = async (id: string, patch: Partial<CarouselItem>) => {
    if (!token) return;
    const updated = await apiService.updateCarouselItem(id, patch as any, token);
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...updated } : i)));
  };

  const deleteItem = async (id: string) => {
    if (!token) return;
    await apiService.deleteCarouselItem(id, token);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const saveOrder = async () => {
    if (!token) return;
    const payload = items.map((i, idx) => ({ id: i.id, order: idx + 1 }));
    await apiService.reorderCarousel(payload, token);
    alert('Order saved');
  };

  const saveMaxSlides = async () => {
    if (!token) return;
    await apiService.updateHomepageSettings({ maxSlides, maxFeatured }, token);
    alert('Settings saved');
  };

  const move = (index: number, dir: -1 | 1) => {
    setItems(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next;
    });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Homepage Settings</h1>

      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-2">General limits</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Max slides</label>
          <input type="number" min={1} max={6} value={maxSlides} onChange={(e) => setMaxSlides(Math.max(1, Math.min(6, Number(e.target.value))))} className="border rounded px-3 py-1 w-24" />
          <div className="text-sm text-gray-500">Active {activeCount} / {maxSlides}</div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <label className="text-sm text-gray-700">Max featured</label>
          <input type="number" min={1} max={24} value={maxFeatured} onChange={(e) => setMaxFeatured(Math.max(1, Math.min(24, Number(e.target.value))))} className="border rounded px-3 py-1 w-24" />
          <button onClick={saveMaxSlides} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Carousel Images</h2>
          <label className="px-4 py-2 bg-emerald-600 text-white rounded cursor-pointer">
            Upload Image
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="space-y-4">
          {items.sort((a, b) => a.order - b.order).map((item, idx) => (
            <div key={item.id} className="flex items-center gap-4 border rounded-lg p-3">
              <img src={item.imageUrl} alt={item.altText || ''} className="w-32 h-20 object-cover rounded" />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input className="border rounded px-3 py-1" placeholder="Alt text" value={item.altText || ''} onChange={(e) => updateItem(item.id, { altText: e.target.value })} />
                <input className="border rounded px-3 py-1" placeholder="Link URL" value={item.linkUrl || ''} onChange={(e) => updateItem(item.id, { linkUrl: e.target.value })} />
                <div className="flex items-center gap-2">
                  <input id={`active-${item.id}`} type="checkbox" checked={item.isActive} onChange={(e) => {
                    if (!e.target.checked && activeCount <= 1) return updateItem(item.id, { isActive: false });
                    if (e.target.checked && activeCount >= maxSlides) return alert('Max active slides reached');
                    updateItem(item.id, { isActive: e.target.checked });
                  }} />
                  <label htmlFor={`active-${item.id}`}>Active</label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => move(idx, -1)} className="px-2 py-1 border rounded">↑</button>
                <button onClick={() => move(idx, 1)} className="px-2 py-1 border rounded">↓</button>
                <button onClick={() => deleteItem(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button onClick={saveOrder} className="px-4 py-2 bg-slate-800 text-white rounded">Save Order</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Featured Properties</h2>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <input value={addingSlugOrId} onChange={(e) => setAddingSlugOrId(e.target.value)} placeholder="Enter property slug or ID" className="border rounded px-3 py-2 flex-1" />
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded"
            onClick={async () => {
              if (!token || !addingSlugOrId) return;
              try {
                let p;
                try {
                  p = await apiService.getPropertyBySlug(addingSlugOrId);
                } catch (e) {
                  // fallback: try by id
                  p = await apiService.getProperty(addingSlugOrId);
                }
                await apiService.adminAddFeatured(p.id, token);
                const f = await apiService.adminListFeatured(token);
                setFeatured(f as any);
                setAddingSlugOrId('');
              } catch (e: any) {
                alert(e?.message || 'Failed to add');
              }
            }}
          >Add</button>
        </div>

        <div className="space-y-3">
          {featured.map((row, idx) => (
            <div key={(row.property as any).id} className="flex items-center gap-4 border rounded-lg p-3">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                {(row.property.images && row.property.images[0]) ? (
                  <img src={row.property.images[0]} alt={row.property.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1">
                <div className="font-medium">{row.property.title}</div>
                <div className="text-sm text-gray-500">{row.property.wilaya}{row.property.daira ? `, ${row.property.daira}` : ''} • {row.property.price?.toLocaleString()} DA</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  setFeatured(prev => {
                    const next = [...prev];
                    if (idx === 0) return prev;
                    const tmp = next[idx - 1];
                    next[idx - 1] = next[idx];
                    next[idx] = tmp;
                    return next;
                  });
                }} className="px-2 py-1 border rounded">↑</button>
                <button onClick={() => {
                  setFeatured(prev => {
                    const next = [...prev];
                    if (idx === prev.length - 1) return prev;
                    const tmp = next[idx + 1];
                    next[idx + 1] = next[idx];
                    next[idx] = tmp;
                    return next;
                  });
                }} className="px-2 py-1 border rounded">↓</button>
                <button onClick={async () => {
                  if (!token) return;
                  await apiService.adminRemoveFeatured((row.property as any).id, token);
                  setFeatured(prev => prev.filter((_, i) => i !== idx));
                }} className="px-3 py-1 bg-red-600 text-white rounded">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button onClick={async () => {
            if (!token) return;
            const payload = featured.map((row, i) => ({ propertyId: (row.property as any).id, position: i + 1 }));
            await apiService.adminReorderFeatured(payload, token);
            alert('Featured order saved');
          }} className="px-4 py-2 bg-slate-800 text-white rounded">Save Featured Order</button>
        </div>
      </div>
    </div>
  );
}


