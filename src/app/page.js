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
        <div className="bg-white rounded-3xl p-2 shadow-xl shadow-slate-200 border border-slate-100 grid grid-cols-4 gap-2">
          {[
            { icon: <Bot size={20} />, label: "Ask AI", color: "bg-purple-100 text-purple-600", link: '/assistant' },
            { icon: <Store size={20} />, label: "Market", color: "bg-orange-100 text-orange-600", link: '/market' },
            { icon: <Leaf size={20} />, label: "Heal", color: "bg-green-100 text-green-600", link: '/doctor' },
            { icon: <BarChart3 size={20} />, label: "Jobs", color: "bg-blue-100 text-blue-600", link: '/jobs' },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => router.push(action.link)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${action.color} shadow-sm`}>
                {action.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-600">{action.label}</span>
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
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {[
            { crop: 'Soyabean', price: '₹4,850', trend: 'up' },
            { crop: 'Cotton', price: '₹6,920', trend: 'down' },
            { crop: 'Onion', price: '₹1,400', trend: 'stable' },
          ].map((item, i) => (
            <div key={i} className="min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-lg">🌾</div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.trend === 'up' ? 'bg-green-50 text-green-600' :
                    item.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                  {item.trend === 'up' ? '▲ 2%' : item.trend === 'down' ? '▼ 1%' : '• 0%'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-700">{item.crop}</h3>
                <p className="text-lg font-extrabold text-slate-900">{item.price}</p>
              </div>
            </div>
          ))}
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
