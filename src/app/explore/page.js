'use client';
import { useState } from 'react';
import { MapPin, Building, ExternalLink, Globe, Phone, Search } from 'lucide-react';

export default function Explore() {
    const [activeTab, setActiveTab] = useState('markets'); // markets, labs, schemes

    const markets = [
        { name: 'Solapur APMC', type: 'Market', location: 'Solapur', link: 'https://maps.google.com/?q=APMC+Market+Solapur' },
        { name: 'Pune Gultekdi Market', type: 'Market', location: 'Pune', link: 'https://maps.google.com/?q=Gultekdi+Market+Pune' },
        { name: 'Latur Soybean Market', type: 'Specialized', location: 'Latur', link: 'https://maps.google.com/?q=Latur+APMC+Market' },
        { name: 'Vashi APMC', type: 'Export Hub', location: 'Navi Mumbai', link: 'https://maps.google.com/?q=APMC+Market+Vashi' },
    ];

    const labs = [
        { name: 'District Soil Testing Lab', type: 'Govt Lab', location: 'Solapur', link: 'https://maps.google.com/?q=Soil+Testing+Laboratory+Solapur' },
        { name: 'KVK Mohol', type: 'Research Center', location: 'Mohol', link: 'https://maps.google.com/?q=Krishi+Vigyan+Kendra+Mohol' },
        { name: 'National Soil Bureau', type: 'Central Lab', location: 'Nagpur', link: 'https://nbsslup.icar.gov.in/' },
    ];

    const schemes = [
        { name: 'MahaDBT Farmer Portal', desc: 'Apply for tractor, drip irrigation & subsidies', link: 'https://mahadbt.maharashtra.gov.in/' },
        { name: 'PM-Kisan Samman Nidhi', desc: '₹6,000/year financial support', link: 'https://pmkisan.gov.in/' },
        { name: 'MahaAgri (Dept of Agriculture)', desc: 'Official diverse schemes & GRs', link: 'https://krishi.maharashtra.gov.in/' },
        { name: 'MSAMB (Marketing Board)', desc: 'Daily mandi prices & export info', link: 'https://www.msamb.com/' },
        { name: 'Soil Health Card', desc: 'Check soil nutrient status', link: 'https://soilhealth.dac.gov.in/' },
        { name: 'Pradhan Mantri Fasal Bima', desc: 'Crop Insurance Scheme', link: 'https://pmfby.gov.in/' },
    ];

    return (
        <main style={{ paddingBottom: '80px', background: '#F5F5F5', minHeight: '100vh' }}>
            <div className="header">
                <h2 className="text-green">Explore Resources</h2>
                <p>Markets, Labs & Govt Schemes</p>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Search Bar Simulation */}
                <div style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    border: '1px solid #E0E0E0'
                }}>
                    <Search size={20} color="#757575" />
                    <input
                        type="text"
                        placeholder="Search nearby places..."
                        style={{ border: 'none', width: '100%', outline: 'none', fontSize: '15px' }}
                    />
                </div>

                {/* Tabs */}
                <div className="flex-between mb-4" style={{ gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {['markets', 'labs', 'schemes'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '24px',
                                border: 'none',
                                background: activeTab === t ? '#2E7D32' : 'white',
                                color: activeTab === t ? 'white' : '#555',
                                fontWeight: '600',
                                textTransform: 'capitalize',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeTab === 'markets' && markets.map((m, i) => (
                        <PlaceCard key={i} item={m} icon={Building} btnText="View on Map" />
                    ))}

                    {activeTab === 'labs' && labs.map((l, i) => (
                        <PlaceCard key={i} item={l} icon={MapPin} btnText="Locate Lab" />
                    ))}

                    {activeTab === 'schemes' && schemes.map((s, i) => (
                        <SchemeCard key={i} item={s} />
                    ))}
                </div>
            </div>
        </main>
    );
}

function PlaceCard({ item, icon: Icon, btnText }) {
    return (
        <div className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '50%', color: '#2E7D32' }}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>{item.name}</h4>
                    <span style={{ fontSize: '12px', color: '#757575' }}>{item.location || item.type}</span>
                </div>
            </div>
            <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    background: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '50%',
                    color: '#2E7D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <ExternalLink size={18} />
            </a>
        </div>
    );
}

function SchemeCard({ item }) {
    return (
        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #F9A825' }}>
            <div className="flex-between mb-2">
                <h4 style={{ margin: 0, fontSize: '15px' }}>{item.name}</h4>
                <Globe size={16} color="#F9A825" />
            </div>
            <p style={{ fontSize: '13px', color: '#616161', marginBottom: '12px' }}>{item.desc}</p>
            <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#F9A825',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none'
                }}
            >
                Visit Official Portal <ExternalLink size={14} />
            </a>
        </div>
    );
}
