// src/components/map/RadarMap.jsx
'use client';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Briefcase, LocateFixed, MapPin, Navigation, ShieldCheck, Layers, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RadarMap({
    role,
    jobs,
    myLocation,
    liveWorkers,
    mapCenter,
    selectedJob,
    setSelectedJob,
    mapType,
    setMapType,
    onLocateMe
}) {
    return (
        <div className="absolute inset-0 z-0 bg-slate-100">
            <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={13}
                className="w-full h-full"
                zoomControl={false}
            >
                {mapType === 'satellite' ? (
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                        attribution='&copy; Google Maps'
                    />
                ) : (
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                )}

                {/* 1. Render Jobs Near Me */}
                {role === 'worker' && jobs.map(job => (
                    <CircleMarker
                        key={job.id}
                        center={[job.latitude, job.longitude]}
                        pathOptions={{ color: '#16a34a', fillColor: '#22c55e', fillOpacity: 0.8 }}
                        radius={12}
                        eventHandlers={{ click: () => setSelectedJob(job) }}
                    >
                    </CircleMarker>
                ))}

                {/* 1b. Render My Custom Location Ping */}
                {role === 'worker' && myLocation && (
                    <CircleMarker
                        center={[myLocation.lat, myLocation.lng]}
                        pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 1 }}
                        radius={8}
                    >
                        <Popup>My Live GPS Position</Popup>
                    </CircleMarker>
                )}

                {/* 2. Employer Tracking Render */}
                {role === 'employer' && Object.values(liveWorkers).map(worker => (
                    <CircleMarker
                        key={worker.worker_id}
                        center={[worker.latitude, worker.longitude]}
                        pathOptions={{ color: '#4b5563', fillColor: '#64748b', fillOpacity: 0.9 }}
                        radius={10}
                    >
                        <Popup>🟢 Active Worker<br />Lat: {worker.latitude}<br />Lng: {worker.longitude}</Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Selected Job Card Overlay */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        initial={{ y: 200, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 200, opacity: 0, scale: 0.9 }}
                        className="absolute bottom-28 left-4 right-4 z-[1000] pointer-events-auto max-w-xl mx-auto"
                    >
                        <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col relative overflow-hidden">
                            <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-50 rounded-full p-1"><MapPin size={16} /></button>
                            <div className="flex justify-between items-start mb-2 pr-8">
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{selectedJob.title}</h3>
                                    <p className="text-xs uppercase font-bold text-slate-500 mt-1 flex items-center gap-1"><ShieldCheck size={14} className="text-blue-500" /> Verified Employer</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-sm font-black px-3 py-1 rounded-xl">₹{selectedJob.salary_per_day}</span>
                            </div>

                            <div className="flex gap-2 mb-4 mt-2">
                                <div className="bg-slate-50 text-slate-600 text-xs py-1.5 px-3 rounded-lg font-semibold border border-slate-100 inline-flex items-center gap-1.5"><LocateFixed size={14} className="text-slate-400" /> {(selectedJob.distance_meters / 1000).toFixed(1)} km away</div>
                                <div className="bg-slate-50 text-slate-600 text-xs py-1.5 px-3 rounded-lg font-semibold border border-slate-100 capitalize">{selectedJob.category}</div>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-slate-900 text-white font-black py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all">Accept Job Instantly</button>
                                <button className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold active:scale-95 transition-all w-16 flex items-center justify-center"><Briefcase size={20} /></button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Map Controls Array */}
            <div className="absolute top-[40%] right-4 z-[2000] flex flex-col gap-3 pointer-events-auto">
                <button
                    onClick={onLocateMe}
                    className="p-3 bg-white rounded-2xl shadow-xl hover:bg-slate-50 border border-slate-100 text-blue-600 active:scale-95 transition-all"
                    title="Find My Location"
                >
                    <Crosshair size={24} strokeWidth={2.5} />
                </button>

                <button
                    onClick={() => setMapType(prev => prev === 'osm' ? 'satellite' : 'osm')}
                    className="p-3 bg-white rounded-2xl shadow-xl hover:bg-slate-50 border border-slate-100 text-slate-700 active:scale-95 transition-all relative overflow-hidden group"
                    title="Toggle Map Provider"
                >
                    <Layers size={24} strokeWidth={2} />
                    {mapType === 'satellite' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>}
                </button>
            </div>
        </div>
    );
}
