'use client';
import { useState, useEffect } from 'react';
import { CloudRain, Sun, Droplets, ArrowRight, MapPin, Wind } from 'lucide-react';
import Link from 'next/link';
import { maharashtraDistricts } from '@/data/maharashtra';

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState(maharashtraDistricts.find(d => d.name === 'Pune') || maharashtraDistricts[0]);
  const [weather, setWeather] = useState({ temp: '--', condition: 'Loading...', humidity: '--', wind: '--', rain: '--' });

  // Fetch Weather
  useEffect(() => {
    async function fetchWeather() {
      try {
        const { lat, lon } = selectedDistrict;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&timezone=auto`);
        const data = await res.json();

        const current = data.current;
        setWeather({
          temp: `${Math.round(current.temperature_2m)}°C`,
          condition: current.rain > 0 ? 'Rainy' : 'Clear', // Simplified
          humidity: `${current.relative_humidity_2m}%`,
          wind: `${current.wind_speed_10m} km/h`,
          rain: `${current.rain} mm`
        });
      } catch (error) {
        console.error("Weather fetch failed", error);
        setWeather(prev => ({ ...prev, condition: 'Unavailable' }));
      }
    }
    fetchWeather();
  }, [selectedDistrict]);

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const district = maharashtraDistricts.find(d => d.name === districtName);
    if (district) setSelectedDistrict(district);
  };

  return (
    <main>
      {/* Header */}
      <div className="header">
        <div className="flex-between">
          <div>
            <h2 className="text-green">Smart Farm</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
              <MapPin size={14} />
              <select
                value={selectedDistrict.name}
                onChange={handleDistrictChange}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#2E7D32',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {maharashtraDistricts.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ width: 40, height: 40, background: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32', fontWeight: 'bold' }}>
            {selectedDistrict.name[0]}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Weather Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white' }}>
          <div className="flex-between">
            <div>
              <h1 style={{ color: 'white', marginBottom: '4px' }}>{weather.temp}</h1>
              <p style={{ color: '#E8F5E9' }}>{weather.condition}</p>
            </div>
            {weather.condition === 'Rainy' ? <CloudRain size={48} color="#90CAF9" /> : <Sun size={48} color="#FFF176" />}
          </div>
          <div className="flex-between" style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
            <div className="flex-col text-center">
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Humidity</span>
              <span style={{ fontWeight: '600' }}>{weather.humidity}</span>
            </div>
            <div className="flex-col text-center">
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Rainfall</span>
              <span style={{ fontWeight: '600' }}>{weather.rain}</span>
            </div>
            <div className="flex-col text-center">
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Wind</span>
              <span style={{ fontWeight: '600' }}>{weather.wind}</span>
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
