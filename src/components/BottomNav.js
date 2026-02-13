'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bot, Sprout, ShoppingCart, Bell } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Assistant', icon: Bot, href: '/assistant' },
    { name: 'Planner', icon: Sprout, href: '/planner' },
    { name: 'Market', icon: ShoppingCart, href: '/market' },
    { name: 'Alerts', icon: Bell, href: '/alerts' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 pb-5 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 min-w-[3.5rem]">
            <div className={`
              p-2 rounded-xl transition-all duration-300
              ${isActive ? 'bg-green-600 text-white shadow-lg shadow-green-200 translate-y-[-5px]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
            `}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
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
