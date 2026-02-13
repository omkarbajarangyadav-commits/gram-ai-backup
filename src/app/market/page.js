'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, Filter, ShoppingBag, Store } from 'lucide-react';
import BottomNav from '@/components/BottomNav';




export default function Market() {
    const [marketData, setMarketData] = useState({});
    const [shopsData, setShopsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedState, setSelectedState] = useState('Maharashtra');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [activeTab, setActiveTab] = useState('rates'); // 'rates' or 'shops'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/market');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setMarketData(data.marketData);
                setShopsData(data.shops);
            } catch (error) {
                console.error('Error fetching market data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Loading State
    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </main>
        );
    }

    // Get available districts for selected state
    const districts = marketData[selectedState] ? Object.keys(marketData[selectedState]) : [];

    // Filter Logic
    let displayData = [];
    if (marketData[selectedState]) {
        if (selectedDistrict === 'All') {
            // Flatten all districts
            Object.values(marketData[selectedState]).forEach(arr => displayData.push(...arr));
        } else {
            displayData = marketData[selectedState][selectedDistrict] || [];
        }
    }

    return (
        <main className="pb-24 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-white p-6 rounded-b-[2rem] shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-green-700">Market Pulse</h2>
                        <p className="text-sm text-slate-500 font-medium">Live Prices & Local Shops</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-full">
                        <ShoppingBag className="text-green-600" size={24} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('rates')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'rates' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Mandi Rates
                    </button>
                    <button
                        onClick={() => setActiveTab('shops')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'shops' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Agri-Shops
                    </button>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {activeTab === 'rates' ? (
                    <>
                        {/* Location Filter */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm uppercase tracking-wide">
                                <Filter size={14} /> Select Location
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedState}
                                    onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('All'); }}
                                    className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold text-slate-700 text-sm outline-none"
                                >
                                    {Object.keys(marketData).map(s => <option key={s} value={s}>{s}</option>)}
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

                        {/* Income Prediction */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-200">
                            <h3 className="opacity-90 font-medium text-sm mb-1">Estimated Revenue</h3>
                            <div className="flex items-end gap-2 mb-4">
                                <h1 className="text-3xl font-bold">₹1,45,000</h1>
                                <span className="text-sm opacity-80 mb-1">/ season</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-semibold bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <span>Avg. for {selectedState}</span>
                                <span className="flex items-center gap-1 bg-white text-orange-600 px-2 py-0.5 rounded ml-2">
                                    <TrendingUp size={12} /> +12%
                                </span>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-800 mt-2">Today's Rates</h3>

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
                                        <div className={`font-bold text-lg ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-500' : 'text-orange-500'}`}>
                                            {item.price}
                                        </div>
                                        <div className={`text-[10px] font-bold uppercase flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-500' : 'text-orange-500'}`}>
                                            {item.trend === 'up' ? <TrendingUp size={12} /> : item.trend === 'down' ? <TrendingDown size={12} /> : '➖'}
                                            {item.trend === 'up' ? 'Rising' : item.trend === 'down' ? 'Falling' : 'Stable'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                No data available.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                            <Store className="text-blue-600 mt-1" size={20} />
                            <div>
                                <h3 className="font-bold text-blue-800">Shop Owners?</h3>
                                <p className="text-sm text-blue-600 mt-1">Register your shop to list products and reach thousands of farmers.</p>
                                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200">Register Shop</button>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-800">Nearby Shops</h3>
                        {shopsData.map((shop, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{shop.name}</h4>
                                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded inline-block mt-1">{shop.type}</span>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded-full">
                                        <MapPin className="text-green-600" size={16} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-bold">View Inventory</button>
                                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-100">Call Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}
