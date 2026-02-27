// src/components/map/AdminHeatmapLeaflet.jsx
'use client';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert } from 'lucide-react';

export default function AdminHeatmapLeaflet({ center, heatmapData, loading }) {
    return (
        <div className="w-full h-full relative">
            {loading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[4000] bg-slate-900 border border-slate-700 text-white px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-sm">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    Calculating Spatial Aggregates...
                </div>
            )}

            <MapContainer
                center={[center.lat, center.lng]}
                zoom={6}
                className="w-full h-full z-0"
                zoomControl={false}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />

                {/* Simulated Heatmap via varying opacities and radius */}
                {heatmapData.length > 0 && heatmapData.map((point, index) => {
                    // Extracting the weight to define size/color representation
                    const weight = point.weight || 0;
                    const radius = Math.min(Math.max(weight / 2, 10), 40);
                    const opacity = Math.min(Math.max(weight / 100, 0.4), 0.9);

                    // Simple color scale: yellow -> orange -> red based on weight
                    let color = '#fbbf24'; // Amber
                    if (weight > 50) color = '#ea580c'; // Orange
                    if (weight > 100) color = '#e11d48'; // Rose
                    if (weight > 200) color = '#9f1239'; // Deep red

                    return (
                        <CircleMarker
                            key={index}
                            center={[point.location.lat, point.location.lng]}
                            pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: opacity }}
                            radius={radius}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
}
