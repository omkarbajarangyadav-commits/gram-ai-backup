'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, MapPin, DollarSign, Filter } from 'lucide-react';

// Pan-India Mock Data (Simulating an API)
const ALL_INDIA_DATA = {
    'Maharashtra': {
        'Solapur': [
            { crop: 'Onion', price: '₹1,200', trend: 'up', location: 'Solapur APMC' },
            { crop: 'Maize', price: '₹1,850', trend: 'stable', location: 'Barshi APMC' }
        ],
        'Latur': [
            { crop: 'Soyabean', price: '₹4,550', trend: 'stable', location: 'Latur APMC' },
            { crop: 'Tur (Arhar)', price: '₹7,200', trend: 'up', location: 'Latur APMC' }
        ],
        'Pune': [
            { crop: 'Tomato', price: '₹850', trend: 'down', location: 'Pune APMC' },
            { crop: 'Potato', price: '₹1,100', trend: 'stable', location: 'Manchar APMC' }
        ],
        'Akola': [
            { crop: 'Cotton (Kapas)', price: '₹6,900', trend: 'up', location: 'Akola APMC' }
        ]
    },
    'Karnataka': {
        'Belagavi': [
            { crop: 'Sugarcane', price: '₹2,900', trend: 'up', location: 'Belagavi APMC' },
            { crop: 'Maize', price: '₹2,100', trend: 'up', location: 'Gokak APMC' }
        ],
        'Hubballi': [
            { crop: 'Cotton', price: '₹7,100', trend: 'stable', location: 'Hubli APMC' },
            { crop: 'Groundnut', price: '₹5,600', trend: 'down', location: 'Dharwad APMC' }
        ]
    },
    'Madhya Pradesh': {
        'Indore': [
            { crop: 'Soyabean', price: '₹4,400', trend: 'down', location: 'Indore Mandi' },
            { crop: 'Wheat', price: '₹2,350', trend: 'stable', location: 'Sanwer Mandi' }
        ],
        'Ujjain': [
            { crop: 'Gram (Chana)', price: '₹5,100', trend: 'up', location: 'Ujjain Mandi' }
        ]
    },
    'Punjab': {
        'Ludhiana': [
            { crop: 'Wheat', price: '₹2,275', trend: 'stable', location: 'Khanna Mandi' },
            { crop: 'Rice (Basmati)', price: '₹3,800', trend: 'up', location: 'Sahnewal Mandi' }
        ]
    }
};

export default function Market() {
    const [selectedState, setSelectedState] = useState('Maharashtra');
    const [selectedDistrict, setSelectedDistrict] = useState('All');

    // Get available districts for selected state
    const districts = ALL_INDIA_DATA[selectedState] ? Object.keys(ALL_INDIA_DATA[selectedState]) : [];

    // Filter Logic
    let displayData = [];
    if (ALL_INDIA_DATA[selectedState]) {
        if (selectedDistrict === 'All') {
            // Flatten all districts
            Object.values(ALL_INDIA_DATA[selectedState]).forEach(arr => displayData.push(...arr));
        } else {
            displayData = ALL_INDIA_DATA[selectedState][selectedDistrict] || [];
        }
    }

    return (
        <main style={{ paddingBottom: '80px' }}>
            <div className="header">
                <h2 className="text-green">Market Pulse</h2>
                <p>Live Prices • Pan-India</p>
            </div>

            <div style={{ padding: '0 20px' }}>

                {/* Location Filter */}
                <div className="card mb-4" style={{ background: '#FAFAFA' }}>
                    <div className="flex-between mb-2">
                        <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Filter size={16} /> Select Location
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                            value={selectedState}
                            onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict('All'); }}
                            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            {Object.keys(ALL_INDIA_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="All">All Districts</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* Income Prediction (Context aware?) */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)', color: 'white' }}>
                    <h3 style={{ color: 'white', opacity: 0.9, fontSize: '16px' }}>Estimated Revenue</h3>
                    <h1 style={{ color: 'white', marginBottom: '8px' }}>₹1,45,000</h1>
                    <div className="flex-between">
                        <span style={{ fontSize: '12px', opacity: 0.9 }}>Avg. for {selectedState}</span>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>+12% Trend</span>
                    </div>
                </div>

                <h3 className="mb-4">Mandi Rates ({selectedDistrict === 'All' ? selectedState : selectedDistrict})</h3>

                {displayData.length > 0 ? (
                    displayData.map((item, i) => (
                        <div key={i} className="card flex-between">
                            <div className="flex-col">
                                <span style={{ fontWeight: '700', fontSize: '18px' }}>{item.crop}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#757575', marginTop: '4px' }}>
                                    <MapPin size={12} /> {item.location}
                                </div>
                            </div>
                            <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                                <span style={{ fontWeight: '700', fontSize: '18px', color: item.trend === 'up' ? '#2E7D32' : item.trend === 'down' ? '#D32F2F' : '#F57C00' }}>
                                    {item.price}
                                    <span style={{ fontSize: '12px', color: '#757575' }}> /qt</span>
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '4px', color: item.trend === 'up' ? '#2E7D32' : item.trend === 'down' ? '#D32F2F' : '#F57C00' }}>
                                    {item.trend === 'up' ? <TrendingUp size={14} /> : item.trend === 'down' ? <TrendingDown size={14} /> : '➖'}
                                    {item.trend === 'up' ? 'Rising' : item.trend === 'down' ? 'Falling' : 'Stable'}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        No data available for this selection.
                    </div>
                )}

                <h3 className="mb-4 mt-4">Selling Insight</h3>
                <div className="card" style={{ borderLeft: '4px solid #2E7D32' }}>
                    <h4 className="flex-between">
                        Best Time to Sell
                        <span className="text-green" style={{ fontSize: '14px', background: '#E8F5E9', padding: '4px 8px', borderRadius: '4px' }}>Next Week</span>
                    </h4>
                    <p style={{ fontSize: '13px', margin: 0 }}>
                        Demand for {displayData[0]?.crop || 'crops'} in {selectedState} is rising due to upcoming festivals.
                    </p>
                </div>
            </div>
        </main>
    );
}
