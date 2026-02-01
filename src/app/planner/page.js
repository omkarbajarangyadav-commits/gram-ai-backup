'use client';
import { useState } from 'react';
import { Sprout, Droplets, Calendar, BarChart2, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Comprehensive Crop Database
const CROP_DATA = {
    // Kharif (Monsoon)
    'Kharif': {
        'black': {
            name: 'Cotton (Kapas)',
            icon: '☁️',
            cost: 15000,
            water: 'Moderate',
            harvest: 'Nov-Dec',
            resources: [{ name: 'Water', value: 30 }, { name: 'Fertilizer', value: 25 }, { name: 'Labor', value: 35 }, { name: 'Seeds', value: 10 }]
        },
        'red': {
            name: 'Groundnut (Mungfali)',
            icon: '🥜',
            cost: 10000,
            water: 'Low',
            harvest: 'Oct-Nov',
            resources: [{ name: 'Water', value: 20 }, { name: 'Fertilizer', value: 30 }, { name: 'Labor', value: 30 }, { name: 'Seeds', value: 20 }]
        },
        'alluvial': {
            name: 'Rice (Paddy)',
            icon: '🌾',
            cost: 18000,
            water: 'High',
            harvest: 'Oct-Nov',
            resources: [{ name: 'Water', value: 50 }, { name: 'Fertilizer', value: 20 }, { name: 'Labor', value: 20 }, { name: 'Seeds', value: 10 }]
        }
    },
    // Rabi (Winter)
    'Rabi': {
        'black': {
            name: 'Gram (Chana)',
            icon: '🥘',
            cost: 8000,
            water: 'Low',
            harvest: 'Feb-Mar',
            resources: [{ name: 'Water', value: 20 }, { name: 'Fertilizer', value: 20 }, { name: 'Labor', value: 40 }, { name: 'Seeds', value: 20 }]
        },
        'red': {
            name: 'Wheat (Gehu)',
            icon: '🍞',
            cost: 11000,
            water: 'Moderate',
            harvest: 'Mar-Apr',
            resources: [{ name: 'Water', value: 40 }, { name: 'Fertilizer', value: 30 }, { name: 'Labor', value: 20 }, { name: 'Seeds', value: 10 }]
        },
        'alluvial': {
            name: 'Wheat (Gehu)',
            icon: '🍞',
            cost: 12000,
            water: 'Moderate',
            harvest: 'Mar-Apr',
            resources: [{ name: 'Water', value: 40 }, { name: 'Fertilizer', value: 30 }, { name: 'Labor', value: 20 }, { name: 'Seeds', value: 10 }]
        }
    },
    // Zaid (Summer)
    'Zaid': {
        'black': {
            name: 'Watermelon',
            icon: '🍉',
            cost: 20000,
            water: 'High',
            harvest: 'May-Jun',
            resources: [{ name: 'Water', value: 45 }, { name: 'Fertilizer', value: 25 }, { name: 'Labor', value: 20 }, { name: 'Seeds', value: 10 }]
        },
        'red': {
            name: 'Maize (Fodder)',
            icon: '🌽',
            cost: 9000,
            water: 'Moderate',
            harvest: 'May-Jun',
            resources: [{ name: 'Water', value: 35 }, { name: 'Fertilizer', value: 25 }, { name: 'Labor', value: 30 }, { name: 'Seeds', value: 10 }]
        },
        'alluvial': {
            name: 'Cucumber',
            icon: '🥒',
            cost: 15000,
            water: 'High',
            harvest: 'May',
            resources: [{ name: 'Water', value: 50 }, { name: 'Fertilizer', value: 20 }, { name: 'Labor', value: 20 }, { name: 'Seeds', value: 10 }]
        }
    }
};

const COLORS = ['#4FC3F7', '#FFB74D', '#81C784', '#A1887F'];

export default function Planner() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ size: '', soil: '', season: 'Kharif' });
    const [recommendation, setRecommendation] = useState(null);

    const handleSubmit = () => {
        // Logic to find best crop
        const seasonData = CROP_DATA[formData.season] || CROP_DATA['Kharif'];
        const soilKey = formData.soil || 'black'; // Default to black if empty
        const crop = seasonData[soilKey] || seasonData['black']; // Fallback

        setRecommendation(crop);
        setStep(2);
    };

    return (
        <main style={{ paddingBottom: '80px' }}>
            <div className="header">
                <h2 className="text-green">Crop Planner</h2>
                <p>Optimize yield & resources</p>
            </div>

            <div style={{ padding: '0 20px' }}>
                {step === 1 ? (
                    <div className="card">
                        <h3 className="mb-4">Farm Details</h3>

                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Land Size (Acres)</label>
                        <input
                            type="number"
                            className="mb-4"
                            value={formData.size}
                            onChange={e => setFormData({ ...formData, size: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            placeholder="e.g. 2.5"
                        />

                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Soil Type</label>
                        <select
                            className="mb-4"
                            value={formData.soil}
                            onChange={e => setFormData({ ...formData, soil: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select Soil</option>
                            <option value="black">Black Soil (Regur)</option>
                            <option value="red">Red Soil</option>
                            <option value="alluvial">Alluvial Soil</option>
                        </select>

                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Season</label>
                        <div className="flex-between mb-4" style={{ gap: '8px' }}>
                            {['Kharif', 'Rabi', 'Zaid'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFormData({ ...formData, season: s })}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: formData.season === s ? '2px solid #2E7D32' : '1px solid #ddd',
                                        background: formData.season === s ? '#E8F5E9' : 'white',
                                        color: formData.season === s ? '#2E7D32' : '#757575',
                                        fontWeight: '600'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <button className="btn btn-primary" onClick={handleSubmit} disabled={!formData.size || !formData.soil}>
                            Get Recommendation
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="card text-center" style={{ background: '#E8F5E9', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', color: '#2E7D32' }}>
                                <CheckCircle size={20} />
                                <h3 style={{ margin: 0 }}>Recommended: {recommendation.name}</h3>
                            </div>
                            <p>Best for <strong>{formData.soil}</strong> soil in <strong>{formData.season}</strong></p>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                                <div style={{ width: 120, height: 120, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                    {recommendation.icon}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="mb-4 flex-between">
                                <span>Resource Plan</span>
                                <span className="text-green" style={{ fontSize: '14px' }}>Est. Cost: ₹{recommendation.cost}</span>
                            </h3>

                            <div style={{ height: '200px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={recommendation.resources} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {recommendation.resources.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-between" style={{ marginTop: '-20px', marginBottom: '20px', fontSize: '12px' }}>
                                {recommendation.resources.map((d, i) => (
                                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                                        {d.name}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <div className="flex-between mb-4 p-2" style={{ background: '#E0F7FA', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <Droplets color="#0288D1" />
                                        <div>
                                            <span style={{ fontWeight: '600', display: 'block' }}>Water Needs</span>
                                            <span style={{ fontSize: '12px' }}>{recommendation.water}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-between p-2" style={{ background: '#FFF3E0', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <Calendar color="#FF9800" />
                                        <div>
                                            <span style={{ fontWeight: '600', display: 'block' }}>Harvest Time</span>
                                            <span style={{ fontSize: '12px' }}>{recommendation.harvest}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-secondary mt-4" onClick={() => setStep(1)}>
                            Plan Another Crop
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
