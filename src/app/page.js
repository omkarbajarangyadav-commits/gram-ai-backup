'use client';
import { useState } from 'react';
import { CloudRain, Sun, Droplets, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [location, setLocation] = useState('Pimpli, Solapur');

  const handleLocationChange = () => {
    // Simple simulation of location switching
    const locations = ['Pimpli, Solapur', 'Indore, MP', 'Ludhiana, Punjab', 'Belagavi, Karnataka'];
    const next = locations[(locations.indexOf(location) + 1) % locations.length];
    setLocation(next);
  };

  return (
    <main>
      {/* Header */}
      <div className="header">
        <div className="flex-between">
          <div>
            <h2 className="text-green">GramAI</h2>
            <div
              onClick={handleLocationChange}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: 0.9 }}
            >
              <MapPin size={14} />
              <p style={{ marginBottom: 0, textDecoration: 'underline' }}>{location}</p>
            </div>
          </div>
          <div style={{ width: 40, height: 40, background: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32', fontWeight: 'bold' }}>
            {location[0]}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Weather Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white' }}>
          <div className="flex-between">
            <div>
              <h1 style={{ color: 'white', marginBottom: '4px' }}>28°C</h1>
              <p style={{ color: '#E8F5E9' }}>Partly Cloudy</p>
            </div>
            <Sun size={48} color="#FFF176" />
          </div>
          <div className="flex-between" style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
            <div className="flex-col text-center">
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Humidity</span>
              <span style={{ fontWeight: '600' }}>65%</span>
            </div>
            <div className="flex-col text-center">
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Rainfall</span>
              <span style={{ fontWeight: '600' }}>12mm</span>
            </div>
            <div className="flex-col text-center">
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Wind</span>
              <span style={{ fontWeight: '600' }}>14km/h</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="mb-4">Quick Actions</h3>
        <div className="grid-2">
          <Link href="/assistant" className="card flex-col" style={{ alignItems: 'center', gap: '12px', border: '1px solid #C8E6C9', textDecoration: 'none' }}>
            <div style={{ background: '#E8F5E9', padding: '12px', borderRadius: '50%' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
            </div>
            <span style={{ fontWeight: '600' }}>Ask AI</span>
          </Link>
          <Link href="/planner" className="card flex-col" style={{ alignItems: 'center', gap: '12px', border: '1px solid #FFE0B2', textDecoration: 'none' }}>
            <div style={{ background: '#FFF3E0', padding: '12px', borderRadius: '50%' }}>
              <span style={{ fontSize: '24px' }}>🌾</span>
            </div>
            <span style={{ fontWeight: '600' }}>Crop Plan</span>
          </Link>
          <Link href="/market" className="card flex-col" style={{ alignItems: 'center', gap: '12px', border: '1px solid #BBDEFB', textDecoration: 'none' }}>
            <div style={{ background: '#E3F2FD', padding: '12px', borderRadius: '50%' }}>
              <span style={{ fontSize: '24px' }}>💰</span>
            </div>
            <span style={{ fontWeight: '600' }}>Prices</span>
          </Link>
          <Link href="/alerts" className="card flex-col" style={{ alignItems: 'center', gap: '12px', border: '1px solid #FFCDD2', textDecoration: 'none' }}>
            <div style={{ background: '#FFEBEE', padding: '12px', borderRadius: '50%' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
            </div>
            <span style={{ fontWeight: '600' }}>Alerts</span>
          </Link>
          <Link href="/explore" className="card flex-col" style={{ alignItems: 'center', gap: '12px', border: '1px solid #E1BEE7', textDecoration: 'none', gridColumn: 'span 2' }}>
            <div style={{ background: '#F3E5F5', padding: '12px', borderRadius: '50%' }}>
              <span style={{ fontSize: '24px' }}>🔍</span>
            </div>
            <span style={{ fontWeight: '600' }}>Explore Resources</span>
          </Link>
        </div>

        {/* Panchayat Link */}
        <Link href="/panchayat" className="card flex-between" style={{ marginTop: '16px', background: '#37474F', color: 'white', textDecoration: 'none' }}>
          <div className="flex-col">
            <span style={{ fontWeight: '600', color: 'white' }}>Gram Panchayat</span>
            <span style={{ fontSize: '12px', color: '#CFD8DC' }}>Admin Dashboard</span>
          </div>
          <ArrowRight />
        </Link>

        <Link href="/architecture" className="text-center block mt-4 mb-4" style={{ color: '#999', fontSize: '11px' }}>
          System Architecture
        </Link>
      </div>
    </main>
  );
}
