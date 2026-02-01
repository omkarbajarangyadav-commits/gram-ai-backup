'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sprout, ShoppingCart, Bell, Bot } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assistant', href: '/assistant', icon: Bot },
    { name: 'Planner', href: '/planner', icon: Sprout },
    { name: 'Market', href: '/market', icon: ShoppingCart },
    { name: 'Alerts', href: '/alerts', icon: Bell },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
