'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bot, Camera, Users, ShoppingCart } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Assistant', icon: Bot, href: '/assistant' },
    { name: 'Heal', icon: Camera, href: '/doctor', isFab: true }, // Central FAB
    { name: 'Community', icon: Users, href: '/community' },
    { name: 'Market', icon: ShoppingCart, href: '/market' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 pb-5 flex justify-between items-end z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] h-20">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        if (item.isFab) {
          return (
            <Link key={item.name} href={item.href} className="relative -top-8 group">
              <div className={`
                 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-500
                 ${isActive ? 'bg-green-600 scale-110 shadow-green-300 ring-4 ring-green-100' : 'bg-green-500 text-white shadow-green-200 group-hover:scale-110'}
               `}>
                <Camera size={28} className="text-white" strokeWidth={2} />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-600 whitespace-nowrap">Heal Crop</span>
            </Link>
          )
        }

        return (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 min-w-[3.5rem] mb-2">
            <div className={`
              transition-all duration-300
              ${isActive ? 'text-green-600 scale-110' : 'text-slate-400 hover:text-slate-600'}
            `}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-green-700' : 'text-slate-400'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
