'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudRain, Sun, Droplets, ArrowRight, MapPin, Leaf, BarChart3, Bot, ChevronRight, Wind, LogOut } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const router = useRouter();
  const [weather, setWeather] = useState(null);
  const [userName, setUserName] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    // 🔒 AUTHENTICATION CHECK
    const storedLanguage = localStorage.getItem('language');
    const storedRole = localStorage.getItem('role');

    if (!storedLanguage || !storedRole) {
      // If not logged in, FORCE redirect to Onboarding/Login
      router.push('/onboarding');
      return;
    }

    // If logged in, load data
    setUserName(storedRole === 'farmer' ? 'Kisan' : 'Vyapari');

    // Fetch Weather (Mock for now, can be real API)
    // ... (rest of the fetch logic)
    setWeather({
      temp: 28,
      condition: 'Sunny',
      humidity: 62,
      location: 'Pune, MH'
    });

    // Fetch dynamic real-world simulated market data
    fetch('/api/market-price')
      .then(res => res.json())
      .then(data => setMarketData(data))
      .catch(err => console.error("Market fetch failed:", err));

    setLoading(false);

  }, [router]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear(); // Clear all data
      router.push('/onboarding');
    }
  };

  if (loading) return null; // Or a loading spinner

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-900 p-6 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Ram Ram, {userName}! 🙏</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Gram <span className="text-yellow-300">Seva</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleLogout} className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                <LogOut size={18} />
              </button>
              <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                <Leaf className="text-yellow-300" size={24} />
              </div>
            </div>
          </div>

          {/* Weather Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-full">
                <Sun className="text-yellow-300 animate-pulse" size={32} />
              </div>
              <div>
                <div className="text-3xl font-bold text-white flex items-start gap-1">
                  {weather?.temp}° <span className="text-lg opacity-60 mt-1">C</span>
                </div>
                <p className="text-green-100 text-sm flex items-center gap-1">
                  <MapPin size={12} /> {weather?.location}
                </p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2 text-green-50 text-xs font-medium bg-black/20 px-2 py-1 rounded-lg">
                <Droplets size={12} className="text-blue-300" />
                {weather?.humidity}% Hum
              </div>
              <div className="flex items-center justify-end gap-2 text-green-50 text-xs font-medium bg-black/20 px-2 py-1 rounded-lg">
                <Wind size={12} className="text-slate-300" />
                12 km/h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-4 shadow-xl shadow-slate-200 border border-slate-100 flex flex-wrap justify-between gap-y-4">
          {[
            { icon: <MapPin size={24} />, label: "Radar", color: "bg-blue-100 text-blue-600 shadow-blue-200", link: '/radar' },
            { icon: <Bot size={24} />, label: "Crop AI", color: "bg-purple-100 text-purple-600 shadow-purple-200", link: '/assistant' },
            { icon: <Leaf size={24} />, label: "Heal", color: "bg-green-100 text-green-600 shadow-green-200", link: '/doctor' },
            { icon: <BarChart3 size={24} />, label: "Jobs", color: "bg-teal-100 text-teal-600 shadow-teal-200", link: '/jobs' },
            { icon: <CloudRain size={24} />, label: "Market", color: "bg-orange-100 text-orange-600 shadow-orange-200", link: '/market' },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => router.push(action.link)}
              className="flex flex-col items-center gap-2 w-[18%] transition-colors active:scale-95 group"
            >
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${action.color} shadow-sm group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-[11px] font-bold text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Market Ticker */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-bold text-slate-800">Market Pulse</h2>
          <button onClick={() => router.push('/market')} className="text-xs font-bold text-green-600 flex items-center gap-1">
            See All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {marketData.length > 0 ? marketData.map((item, i) => (
            <div key={i} className="snap-start min-w-[150px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 relative overflow-hidden group hover:border-green-300 transition-colors">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-slate-50 rounded-full group-hover:bg-green-50 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner">
                  {item.crop === 'Soybean' ? '🌱' : item.crop === 'Cotton' ? '☁️' : item.crop === 'Onion' ? '🧅' : '🌾'}
                </div>
                <span className={`text-[11px] font-black px-2 py-1 rounded-lg ${item.trend === 'up' ? 'bg-green-100 text-green-700' :
                  item.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                  {item.trend === 'up' ? `▲ ${item.percentage}%` : item.trend === 'down' ? `▼ ${item.percentage}%` : '• 0%'}
                </span>
              </div>
              <div className="relative z-10 mt-1">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.crop}</h3>
                <p className="text-xl font-black text-slate-900 tracking-tight">₹{item.price}<span className="text-xs text-slate-400 font-semibold ml-1">/q</span></p>
              </div>
            </div>
          )) : (
            <div className="text-sm font-medium text-slate-400 p-4">Analyzing real-time market nodes...</div>
          )}
        </div>
      </div>

      {/* Feature Banner */}
      <div className="px-6 mb-24">
        <div onClick={() => router.push('/doctor')} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm">NEW FEATURE</span>
            <h3 className="text-xl font-bold mt-2 mb-1">Crop Doctor AI</h3>
            <p className="text-blue-100 text-sm mb-4 max-w-[70%]">Take a photo of your sick crop and get instant remedy.</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold shadow-md">Try Now</button>
          </div>
          <img src="https://illustrations.popsy.co/amber/success.svg" className="absolute bottom-[-20px] right-[-20px] w-32 opacity-90 grayscale brightness-200 contrast-200" alt="Plant" />
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
