'use client';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string | undefined;
(mapboxgl as any).accessToken = MAPBOX_TOKEN || '';

type Pin = { name: string; cat: string; note?: string; lng: number; lat: number; visited?: boolean };

const seedPins: Pin[] = [
  { name: 'Restaurant De Kas', cat: 'food', lng: 4.940, lat: 52.347, note: 'Greenhouse dining' },
  { name: 'Winkel 43', cat: 'food', lng: 4.883, lat: 52.376, note: 'Apple pie legend' },
  { name: 'Brouwerij \'t IJ', cat: 'drink', lng: 4.936, lat: 52.366, note: 'Windmill taproom' },
  { name: 'Shelter', cat: 'nightlife', lng: 4.900, lat: 52.384, note: 'Underground club' },
  { name: 'Paradiso', cat: 'nightlife', lng: 4.884, lat: 52.363, note: 'Iconic venue' },
  { name: 'Rijksmuseum', cat: 'culture', lng: 4.885, lat: 52.360, note: 'Dutch masters' },
  { name: 'Van Gogh Museum', cat: 'culture', lng: 4.879, lat: 52.358, note: 'VG collection' },
  { name: 'Vondelpark', cat: 'nature', lng: 4.868, lat: 52.357, note: 'Beloved park' },
  { name: 'De Negen Straatjes', cat: 'shops', lng: 4.885, lat: 52.371, note: 'Boutique area' },
  { name: 'A\'DAM Lookout + Swing', cat: 'misc', lng: 4.900, lat: 52.383, note: 'Skyline views' },
];

const categories = [
  { key: 'food', label: 'Food', color: '#ef4444' },
  { key: 'drink', label: 'Drink', color: '#06b6d4' },
  { key: 'culture', label: 'Culture', color: '#8b5cf6' },
  { key: 'nature', label: 'Nature', color: '#22c55e' },
  { key: 'shops', label: 'Shops', color: '#f59e0b' },
  { key: 'nightlife', label: 'Nightlife', color: '#f43f5e' },
  { key: 'misc', label: 'Miscellaneous', color: '#14b8a6' },
];

export default function MapPage() {
  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-4 text-sm">
        Map unavailable: missing <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>.  
        Add it in Vercel → Project → Settings → Environment Variables (Production), then Redeploy.
      </div>
    );
  }
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const center = [4.872, 52.397]; // centered near Houthavens; address stays private
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [4.872, 52.397] as [number, number],
      zoom: 12.3,
      attributionControl: true
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    mapInstance.current = map;

    map.on('load', () => {
      // add pins as a GeoJSON source + layer
      
      const pins = seedPins;
      const fc = {
  type: 'FeatureCollection' as const,
  features: pins.map((p: any) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      // IMPORTANT: lng, lat tuple
      coordinates: [p.lng, p.lat] as [number, number],
    },
    properties: {
      name: p.name,
      cat: p.cat,
      note: p.note ?? '',
    },
  })),
};

map.addSource('pins', {
  type: 'geojson',
  data: fc as any, 
});
      map.addLayer({
        id: 'pins',
        type: 'circle',
        source: 'pins',
        paint: {
          'circle-radius': 7,
          'circle-color': [
            'match', ['get', 'cat'],
            'food', '#ef4444',
            'drink', '#06b6d4',
            'culture', '#8b5cf6',
            'nature', '#22c55e',
            'shops', '#f59e0b',
            'nightlife', '#f43f5e',
            'misc', '#14b8a6',
            '#00B3FF'
          ],
          'circle-stroke-color': '#111827',
          'circle-stroke-width': 0.6
        }
      });

      const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: true });
      map.on('mousemove', 'pins', (e) => {
        if (!e.features?.length) return;
        const f = e.features[0];
        const coords: [number, number] =
  f.geometry.type === 'Point'
    ? (f.geometry.coordinates as [number, number])
    : [0, 0];
        popup
          .setLngLat(coords)
          .setHTML(`<div style="font-weight:600">${f.properties?.name}</div><div style="font-size:12px;color:#666">${f.properties?.note || ''}</div>`)
          .addTo(map);
      });
      map.on('mouseleave', 'pins', () => popup.remove());
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const expr = filter === 'all' ? ['!=', ['get', 'cat'], '___none___'] : ['==', ['get', 'cat'], filter];
    map.setFilter('pins', expr as any);
  }, [filter]);

  return (
    <div className="space-y-4">
      <section className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-black/5">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent grad-anim mb-3">Map</h2>
        <div ref={mapRef} className="w-full h-[420px] rounded-3xl border border-black/10 overflow-hidden" />
        <div className="mt-3 flex items-center gap-2">
          <label className="text-sm">Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-black/10">
            <option value="all">All</option>
            {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
      </section>
    </div>
  );
}
