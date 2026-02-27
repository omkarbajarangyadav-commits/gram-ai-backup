'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

// Next.js dynamic import wrapper for Leaflet (skips SSR)
const LeafletRadarMap = dynamic(() => import('@/components/map/RadarMap'), { ssr: false });

export default function UberRadarApp() {
    const [role, setRole] = useState('worker'); // 'worker' or 'employer'
    const [myLocation, setMyLocation] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [liveWorkers, setLiveWorkers] = useState({}); // Employer tracking Map
    const [selectedJob, setSelectedJob] = useState(null);
    const [radius, setRadius] = useState(5000);
    const [isPremium, setIsPremium] = useState(false); // Simulate sub fetch
    const [mapType, setMapType] = useState('osm'); // 'osm' or 'satellite'
    const mapCenter = myLocation || { lat: 20.5937, lng: 78.9629 }; // Default India

    const supabase = createClient();

    // 1. WATCH POSITION & UPDATE REAL-TIME
    useEffect(() => {
        if (role !== 'worker' || !navigator.geolocation) return;

        let watchId;
        let lastPushed = Date.now();

        const pushLocationToDB = async (lat, lon) => {
            await fetch('/api/worker/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude: lat, longitude: lon, is_online: true })
            });
            fetchJobs(lat, lon);
        };

        watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setMyLocation({ lat: latitude, lng: longitude });

                if (Date.now() - lastPushed > 10000) {
                    pushLocationToDB(latitude, longitude);
                    lastPushed = Date.now();
                }
            },
            (err) => {
                // Ignore empty errors often thrown by browsers on localhost timeouts
                if (err.code !== undefined) console.warn("GPS Watch Warning:", err.message);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [role, radius]);

    // MANUAL LOCATE BUTTON FUNCTION
    const handleLocateMe = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.warn("Manual GPS Error:", err.message),
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    // 2. FETCH GEO JOBS
    const fetchJobs = useCallback(async (lat, lon) => {
        try {
            const res = await fetch(`/api/jobs/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
            if (res.ok) setJobs(await res.json());
        } catch (e) {
            console.error(e);
        }
    }, [radius]);


    // 3. EMPLOYER REAL-TIME WORKER SUBSCRIPTION
    useEffect(() => {
        if (role !== 'employer') return;

        const fetchOnlineWorkers = async () => {
            const { data } = await supabase.from('worker_locations').select('*').eq('is_online', true);
            const workersMap = {};
            data?.forEach(w => workersMap[w.worker_id] = w);
            setLiveWorkers(workersMap);
        };

        fetchOnlineWorkers();

        const channel = supabase.channel('worker-tracking')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'worker_locations' }, (payload) => {
                const workerData = payload.new;
                if (payload.eventType === 'DELETE' || !workerData.is_online) {
                    setLiveWorkers(prev => {
                        const clone = { ...prev };
                        delete clone[workerData.worker_id];
                        return clone;
                    });
                } else {
                    setLiveWorkers(prev => ({ ...prev, [workerData.worker_id]: workerData }));
                }
            }).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [role, supabase]);


    return (
        <div className="h-screen w-full flex flex-col relative overflow-hidden bg-slate-900">
            {/* Top Banner Control */}
            <div className="absolute top-0 w-full z-[2000] p-4 pointer-events-none">
                <div className="bg-white/90 backdrop-blur shadow-2xl rounded-2xl p-4 flex flex-col gap-3 pointer-events-auto max-w-xl mx-auto">
                    <div className="flex justify-between items-center bg-transparent">
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">Krishi Radar</h1>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => { setRole('worker'); setJobs([]); }}
                                className={`text-sm px-4 py-1.5 rounded-md font-bold transition-all ${role === 'worker' ? 'bg-white shadow text-green-600' : 'text-slate-500 bg-transparent border-none'}`}
                            >Worker</button>
                            <button
                                onClick={() => { setRole('employer'); setLiveWorkers({}); }}
                                className={`text-sm px-4 py-1.5 rounded-md font-bold transition-all ${role === 'employer' ? 'bg-white shadow text-blue-600' : 'text-slate-500 bg-transparent border-none'}`}
                            >Employer</button>
                        </div>
                    </div>

                    {role === 'worker' && (
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Search Radius: <span className="text-slate-700">{radius / 1000} KM</span></label>
                                <input
                                    type="range"
                                    min="1000"
                                    max={isPremium ? "10000" : "5000"}
                                    step="1000"
                                    value={radius}
                                    onChange={(e) => {
                                        setRadius(Number(e.target.value));
                                        if (myLocation) fetchJobs(myLocation.lat, myLocation.lng);
                                    }}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600 outline-none"
                                />
                            </div>
                            {!isPremium && <button onClick={() => setIsPremium(true)} className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 outline-none rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/20"><Zap size={14} /> Upgrade 10km</button>}
                        </div>
                    )}
                </div>
            </div>

            {/* 100% Free Leaflet Layer */}
            <LeafletRadarMap
                role={role}
                jobs={jobs}
                myLocation={myLocation}
                liveWorkers={liveWorkers}
                mapCenter={mapCenter}
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
                mapType={mapType}
                setMapType={setMapType}
                onLocateMe={handleLocateMe}
            />
        </div>
    );
}
