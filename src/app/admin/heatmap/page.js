'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Briefcase, ShieldAlert, Download } from 'lucide-react';
import dynamic from 'next/dynamic';

// Next.js dynamic import wrapper for Leaflet (skips SSR)
const HeatmapLeaflet = dynamic(() => import('@/components/map/AdminHeatmapLeaflet'), { ssr: false });

export default function AdminHeatmap() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);

    const mapCenter = { lat: 20.5937, lng: 78.9629 }; // Default India

    useEffect(() => {
        // Fetch aggregated PostGIS 1KM Hex-Grid Heatmap density
        const fetchHeatmap = async () => {
            try {
                const res = await fetch('/api/jobs/heatmap');
                const data = await res.json();

                // Pure JSON parsing (no Google SDK proprietary objects needed anymore)
                const mapPoints = data.map(point => ({
                    location: { lat: point.grid_lat, lng: point.grid_lon },
                    weight: parseInt(point.job_count) * 10
                }));
                setHeatmapData(mapPoints);
            } catch (err) {
                console.error("Heatmap Load Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHeatmap();
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden font-sans">

            {/* Sidebar Admin Controls */}
            <aside className="w-full md:w-80 bg-slate-900 text-slate-300 flex flex-col z-20 shadow-2xl">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Flame className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Demand Heatmap</h1>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">God Mode Analytics</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    {/* Stat Card */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-400">Total Active Jobs</span>
                            <Briefcase size={16} className="text-blue-400" />
                        </div>
                        <span className="text-3xl font-black text-white tracking-tight">12,408</span>
                        <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Updates
                        </div>
                    </motion.div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert size={14} /> Critical Zones
                        </h3>
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 cursor-pointer hover:bg-rose-500/20 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-sm">Nagpur District</span>
                                <span className="text-xs font-black bg-rose-500 text-white px-2 py-0.5 rounded-lg">High</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">1,200 open harvesting jobs. Severe labor shortage detected.</p>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 cursor-pointer hover:bg-amber-500/20 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-sm">Latur Region</span>
                                <span className="text-xs font-black bg-amber-500 text-white px-2 py-0.5 rounded-lg">Medium</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Tractor drivers in high demand due to rain forecast.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800">
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 shadow-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Download size={16} /> Export CSV Grid
                    </button>
                </div>
            </aside>

            {/* Map Area */}
            <main className="flex-1 relative bg-slate-900 border-l border-slate-800">
                <HeatmapLeaflet center={mapCenter} heatmapData={heatmapData} loading={loading} />
            </main>

        </div>
    );
}
