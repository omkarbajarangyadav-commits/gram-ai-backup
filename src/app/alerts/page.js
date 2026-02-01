'use client';
import { AlertTriangle, CloudRain, Sun, Bug } from 'lucide-react';

export default function Alerts() {
    const alerts = [
        { type: 'High', title: 'Heavy Rainfall Alert', desc: 'Expected >50mm rain in next 24hrs. Ensure drainage is clear.', icon: CloudRain, color: '#D32F2F', bg: '#FFEBEE', link: 'https://mausam.imd.gov.in/' },
        { type: 'Med', title: 'Pest Outbreak Risk', desc: 'Fall Armyworm active in solapur district. Inspect maize crops.', icon: Bug, color: '#F57C00', bg: '#FFF3E0', link: 'https://ppqs.gov.in/' },
        { type: 'Low', title: 'Dry Spell Ahead', desc: 'No rain expected for next 10 days. Plan irrigation accordingly.', icon: Sun, color: '#388E3C', bg: '#E8F5E9', link: 'https://nraa.gov.in/' },
    ];

    return (
        <main style={{ paddingBottom: '80px' }}>
            <div className="header">
                <h2 className="text-green">Risk Alerts</h2>
                <p>Stay prepared, minimize loss</p>
            </div>

            <div style={{ padding: '0 20px' }}>
                {alerts.map((alert, i) => {
                    const Icon = alert.icon;
                    return (
                        <div key={i} className="card" style={{ borderLeft: `6px solid ${alert.color}` }}>
                            <div className="flex-between mb-4">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: alert.bg, padding: '10px', borderRadius: '50%', color: alert.color }}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '16px' }}>{alert.title}</h3>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: alert.color, textTransform: 'uppercase' }}>{alert.type} PRIORITY</span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ marginBottom: '16px', fontSize: '14px' }}>{alert.desc}</p>
                            <a href={alert.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <button className="btn" style={{ background: alert.bg, color: alert.color, padding: '10px', fontSize: '14px', height: 'auto', width: '100%', cursor: 'pointer' }}>
                                    View Action Plan
                                </button>
                            </a>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
