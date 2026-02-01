'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldCheck, Droplets, Users } from 'lucide-react';

export default function Panchayat() {
    const cropData = [
        { name: 'Soyabean', acres: 1200 },
        { name: 'Sugarcane', acres: 800 },
        { name: 'Maize', acres: 400 },
        { name: 'Cotton', acres: 600 },
    ];

    const waterData = [
        { day: 'Mon', usage: 4000 },
        { day: 'Tue', usage: 3000 },
        { day: 'Wed', usage: 2000 },
        { day: 'Thu', usage: 2780 },
        { day: 'Fri', usage: 1890 },
        { day: 'Sat', usage: 2390 },
        { day: 'Sun', usage: 3490 },
    ];

    return (
        <main style={{ paddingBottom: '80px' }}>
            <div className="header" style={{ background: '#37474F' }}>
                <h2 style={{ color: 'white' }}>Panchayat Admin</h2>
                <p style={{ color: '#CFD8DC' }}>Overview of Pimpli Village</p>
            </div>

            <div style={{ padding: '0 20px', marginTop: '-20px' }}>
                {/* Sustainability Score */}
                <div className="card text-center" style={{ padding: '30px', boxShadow: '0 10px 30px rgba(46, 125, 50, 0.2)' }}>
                    <span style={{ color: '#757575', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sustainability Score</span>
                    <div style={{ fontSize: '56px', fontWeight: '800', color: '#2E7D32', margin: '10px 0' }}>84<span style={{ fontSize: '24px', color: '#81C784' }}>/100</span></div>
                    <p style={{ color: '#388E3C', background: '#E8F5E9', display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Excellent</p>
                </div>

                <div className="grid-2 mt-4">
                    <div className="card flex-col" style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={24} className="mb-4 text-brown" style={{ color: '#795548' }} />
                        <h3 style={{ fontSize: '24px', margin: 0 }}>3,420</h3>
                        <span style={{ fontSize: '12px' }}>Total Farmers</span>
                    </div>
                    <div className="card flex-col" style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={24} className="mb-4 text-green" />
                        <h3 style={{ fontSize: '24px', margin: 0 }}>92%</h3>
                        <span style={{ fontSize: '12px' }}>Scheme Coverage</span>
                    </div>
                </div>

                <div className="card mt-4">
                    <h3 className="mb-4">Crop Distribution (Acres)</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cropData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="acres" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card mt-4">
                    <h3 className="mb-4 flex-between">
                        <span>Water Usage Trend</span>
                        <Droplets size={16} color="#03A9F4" />
                    </h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={waterData}>
                                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="usage" stroke="#03A9F4" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </main>
    );
}
