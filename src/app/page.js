'use client';
import { useState, useEffect } from 'react';
import { CloudRain, Sun, Droplets, ArrowRight, MapPin, Leaf, BarChart3, Bot, ChevronRight, Wind } from 'lucide-react';
import Link from 'next/link';
import { maharashtraDistricts } from '@/data/maharashtra';
import { motion } from 'framer-motion';

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
          condition: current.rain > 0 ? 'Rainy' : 'Clear',
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
    <main className="min-h-screen bg-slate-50 mobile-container pb-24">

      {/* 1. Header & Location */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Smart Farm</h1>
            <p className="text-sm text-slate-500 font-medium">Your Daily Insight</p>
          </div>
          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
            {selectedDistrict.name[0]}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-xl">
          <MapPin size={18} className="text-green-600" />
          <select
            value={selectedDistrict.name}
            onChange={handleDistrictChange}
            className="bg-transparent font-semibold text-slate-700 outline-none w-full text-sm"
          >
            {maharashtraDistricts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">

        {/* 2. Weather Card (Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 shadow-xl shadow-green-200"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <CloudRain size={100} />
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-5xl font-bold mb-1">{weather.temp}</h2>
              <p className="text-green-100 font-medium text-lg">{weather.condition}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              {weather.condition === 'Rainy' ? <CloudRain size={32} /> : <Sun size={32} />}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-2 mt-8 bg-black/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <div className="text-center">
              <p className="text-xs text-green-100 mb-1">Humidity</p>
              <p className="font-bold">{weather.humidity}</p>
            </div>
            <div className="text-center border-l border-white/20">
              <p className="text-xs text-green-100 mb-1">Rain</p>
              <p className="font-bold">{weather.rain}</p>
            </div>
            <div className="text-center border-l border-white/20">
              <p className="text-xs text-green-100 mb-1">Wind</p>
              <p className="font-bold">{weather.wind}</p>
            </div>
          </div>
        </motion.div>

        {/* 3. Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/assistant" className="group">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 h-full relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 bg-blue-50 w-20 h-20 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <Bot className="text-blue-600 mb-3 relative z-10" size={28} />
              <h3 className="font-bold text-slate-800 relative z-10">AI Expert</h3>
              <p className="text-xs text-slate-400 mt-1 relative z-10">Ask questions</p>
            </div>
          </Link>

          <Link href="/explore" className="group">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 h-full relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 bg-orange-50 w-20 h-20 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <Leaf className="text-orange-600 mb-3 relative z-10" size={28} />
              <h3 className="font-bold text-slate-800 relative z-10">Resources</h3>
              <p className="text-xs text-slate-400 mt-1 relative z-10">Schemes & Labs</p>
            </div>
          </Link>
        </div>

        {/* 4. Market Insights Teaser (Static for now) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-purple-600" />
              Market Trends
            </h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">Live</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-slate-700 text-sm">Soybean</p>
                <p className="text-xs text-slate-400">Latur Mandi</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-sm">₹4,800</p>
                <p className="text-[10px] text-green-600 flex items-center justify-end">
                  ▲ 2.1%
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-700 text-sm">Cotton</p>
                <p className="text-xs text-slate-400">Akola Mandi</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-500 text-sm">₹6,950</p>
                <p className="text-[10px] text-red-500 flex items-center justify-end">
                  ▼ 0.5%
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
