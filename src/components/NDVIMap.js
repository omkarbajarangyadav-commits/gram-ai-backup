'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock farm polygon coords
const farmCoords = [
    [18.5204, 73.8567],
    [18.5214, 73.8577],
    [18.5194, 73.8587],
    [18.5184, 73.8567],
];

export default function NDVIMap() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Wait for hydration to avoid SSR window errors
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-64 bg-muted animate-pulse rounded-2xl flex items-center justify-center">
                <p className="text-muted-foreground font-semibold text-sm">Loading Satellite Data...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-sm border border-border">
            <MapContainer
                center={[18.5204, 73.8567]}
                zoom={16}
                scrollWheelZoom={false}
                className="w-full h-full"
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                />
                {/* Mock NDVI Overlay using polygon tinting */}
                <Polygon
                    positions={farmCoords}
                    pathOptions={{ fillColor: 'hsl(var(--primary))', fillOpacity: 0.6, color: 'hsl(var(--primary))', weight: 2 }}
                >
                    <Popup>
                        <div className="p-1">
                            <h4 className="font-bold text-sm mb-1">Sector A</h4>
                            <p className="text-xs text-muted-foreground mb-2">NDVI Health: 0.82 (Excellent)</p>
                            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                <div className="w-[82%] bg-primary h-full"></div>
                            </div>
                        </div>
                    </Popup>
                </Polygon>
            </MapContainer>
        </div>
    );
}
