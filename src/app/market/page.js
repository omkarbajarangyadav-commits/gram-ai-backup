'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, MapPin, Filter, ShoppingBag, Store, ChevronLeft, LogOut, Loader2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Market() {
    const router = useRouter();

    // SAFE INITIAL STATE
    const [marketData, setMarketData] = useState(null);
    const [shopsData, setShopsData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedState, setSelectedState] = useState('Maharashtra');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [activeTab, setActiveTab] = useState('rates');

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('language');
            localStorage.removeItem('role');
            router.push('/login');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/market', {
                    cache: 'no-store' // Ensure fresh data
                });

                if (!response.ok) throw new Error('Network error');

                const data = await response.json();

                // Safe Setters with Fallbacks
                setMarketData(data.marketData || {});
                setShopsData(Array.isArray(data.shops) ? data.shops : []);

            } catch (err) {
                console.error('Market Fetch Error:', err);
                setError('Failed to load market data.');
                setMarketData({});
                setShopsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-green-600 h-8 w-8" />
            </main>
        );
    }

    // Safely derive districts
    const safeMarketData = marketData || {};
    const stateData = safeMarketData[selectedState];
    const districts = stateData ? Object.keys(stateData) : [];

    // Filter Logic
    let displayData = [];
    if (stateData) {
        if (selectedDistrict === 'All') {
            Object.values(stateData).forEach(arr => {
                if (Array.isArray(arr)) displayData.push(...arr);
            });
        } else {
            displayData = stateData[selectedDistrict] || [];
        }
    }

    return (
        <main className="pb-24 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-white p-6 rounded-b-[2rem] shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 bg-slate-100 rounded-full text-slate-600">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-extrabold text-green-700">Market Pulse</h2>
                            <p className="text-sm text-slate-500 font-medium">Live Prices & Local Shops</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleLogout} className="p-2 bg-red-50 text-red-500 rounded-full">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('rates')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'rates' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
                    >
                        Mandi Rates
                    </button>
                    <button
                        onClick={() => setActiveTab('shops')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'shops' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
                    >
                        Agri-Shops
                    </button>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {error && (
                    <div className="bg-red-50 p-3 rounded-xl text-red-600 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                {activeTab === 'rates' ? (
                    <>
                        {/* Filters */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm uppercase">
                                <Filter size={14} /> Select Location
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedState}
                                    onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('All'); }}
                                    className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold text-slate-700 text-sm outline-none"
                                >
                                    {Object.keys(safeMarketData).length > 0 ?
                                        Object.keys(safeMarketData).map(s => <option key={s} value={s}>{s}</option>)
                                        : <option>Loading...</option>
                                    }
                                </select>

                                <select
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold text-slate-700 text-sm outline-none"
                                >
                                    <option value="All">All Districts</option>
                                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* List */}
                        {displayData.length > 0 ? (
                            displayData.map((item, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{item.crop}</h4>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-1">
                                            <MapPin size={12} /> {item.location}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg text-green-600">{item.price}</div>
                                        <div className="text-[10px] font-bold uppercase flex items-center justify-end gap-1 text-green-600">
                                            <TrendingUp size={12} /> {item.change || 'Rising'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                No rates available for this selection.
                            </div>
                        )}
                    </>
                ) : (
                    /* SHOPS TAB */
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                            <Store className="text-blue-600 mt-1" size={20} />
                            <div>
                                <h3 className="font-bold text-blue-800">Shop Owner?</h3>
                                <button
                                    onClick={() => router.push('/register-shop')}
                                    className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                                >
                                    Register Free
                                </button>
                            </div>
                        </div>

                        {shopsData.length > 0 ? (
                            shopsData.map((shop, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                    <h4 className="font-bold text-slate-800 text-lg">{shop.name}</h4>
                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded inline-block mt-1">
                                        {shop.category || shop.type || 'Shop'}
                                    </span>
                                    <div className="flex items-center gap-2 mt-4">
                                        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-100">
                                            Call Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                No shops found nearby.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}
