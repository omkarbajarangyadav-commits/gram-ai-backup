'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CloudRain, Sun, Droplets, ArrowRight, MapPin, Leaf, BarChart3, Bot, ChevronRight, Wind, LogOut } from 'lucide-react';
import Link from 'next/link';
import { maharashtraDistricts } from '@/data/maharashtra';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState(maharashtraDistricts.find(d => d.name === 'Pune') || maharashtraDistricts[0]);
  const [weather, setWeather] = useState({ temp: '--', condition: 'Loading...', humidity: '--', wind: '--', rain: '--' });
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('language');
      localStorage.removeItem('role');
      router.push('/login');
    }
  };

  // 1. Check Auth / Onboarding (Auto-Authorize / Guest Mode)
  useEffect(() => {
    let lang = localStorage.getItem('language');
    let role = localStorage.getItem('role');

    // "Authorized to everyone" - Auto-fill defaults if missing
    if (!lang) {
      lang = 'en';
      localStorage.setItem('language', 'en');
    }

    if (!role) {
      role = 'farmer';
      localStorage.setItem('role', 'farmer');
    }

    setCheckingAuth(false);
  }, []);

  // Fetch Weather
  useEffect(() => {
    if (checkingAuth) return;

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
  }, [selectedDistrict, checkingAuth]);

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const district = maharashtraDistricts.find(d => d.name === districtName);
    if (district) setSelectedDistrict(district);
  };

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <main className="min-h-screen bg-[#F1F5F9] pb-32 font-sans">

      {/* 1. Header & Location */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Smart Farm</h1>
            <p className="text-sm text-slate-500 font-medium">Your Daily Insight</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
              <LogOut size={18} />
            </button>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg shadow-sm">
              {selectedDistrict.name[0]}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div className="bg-white p-2 rounded-full shadow-sm text-green-600">
            <MapPin size={18} />
          </div>
          <select
            value={selectedDistrict.name}
            onChange={handleDistrictChange}
            className="bg-transparent font-semibold text-slate-700 outline-none w-full text-sm appearance-none"
          >
            {maharashtraDistricts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
          <ChevronRight size={16} className="text-slate-400" />
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">

        {/* 2. Weather Card (Exact Match) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#10B981] text-white p-6 shadow-xl shadow-green-200/50"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CloudRain size={120} strokeWidth={1} />
          </div>

          <div className="relative z-10 flex justify-between items-start mb-8">
            <div>
              <h2 className="text-5xl font-bold mb-1 tracking-tight">{weather.temp}</h2>
              <p className="text-green-50 font-medium text-lg opacity-90">{weather.condition}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              {weather.condition === 'Rainy' ? <CloudRain size={32} className="text-white" /> : <Sun size={32} className="text-yellow-300" />}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-0 bg-black/10 rounded-2xl backdrop-blur-sm border border-white/5 divide-x divide-white/10 p-4">
            <div className="text-center px-2">
              <p className="text-[10px] uppercase tracking-wider text-green-100 mb-1 opacity-70">Humidity</p>
              <p className="font-bold text-sm">{weather.humidity}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] uppercase tracking-wider text-green-100 mb-1 opacity-70">Rain</p>
              <p className="font-bold text-sm">{weather.rain}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] uppercase tracking-wider text-green-100 mb-1 opacity-70">Wind</p>
              <p className="font-bold text-sm">{weather.wind}</p>
            </div>
          </div>
        </motion.div>

        {/* 3. Quick Actions Grid (Polished) */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/assistant" className="group">
            <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-lg transition-all active:scale-95 h-full relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Bot className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">AI Expert</h3>
                <p className="text-xs text-slate-400 font-medium">Ask questions</p>
              </div>
              <div className="absolute -right-6 -bottom-6 bg-blue-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
            </div>
          </Link>

          <Link href="/explore" className="group">
            <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-lg transition-all active:scale-95 h-full relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                <Leaf className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Resources</h3>
                <p className="text-xs text-slate-400 font-medium">Schemes & Labs</p>
              </div>
              <div className="absolute -right-6 -bottom-6 bg-orange-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
            </div>
          </Link>
        </div>

        {/* 4. Market Insights (Updated) */}
        <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-purple-100 p-1.5 rounded-lg text-purple-600"><BarChart3 size={16} /></span>
              Market Trends
            </h3>
            <span className="text-[10px] bg-red-50 text-red-500 px-2 py-1 rounded-full font-bold uppercase tracking-wide animate-pulse">Live</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Soybean', mandi: 'Latur Mandi', price: '₹4,800', change: '+2.1%', trend: 'up' },
              { name: 'Cotton', mandi: 'Akola Mandi', price: '₹6,950', change: '-0.5%', trend: 'down' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">{item.mandi}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-sm">{item.price}</p>
                  <p className={`text-[10px] font-bold flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {item.trend === 'up' ? '▲' : '▼'} {item.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </main>
  );
}
