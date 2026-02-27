'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Settings, Sprout, CloudRain, BarChart, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/fields', label: 'My Fields', icon: Sprout },
    { href: '/dashboard/weather', label: 'Weather & Irrigation', icon: CloudRain },
    { href: '/dashboard/analytics', label: 'Market & Yield', icon: BarChart },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <aside className="w-64 hidden lg:flex flex-col bg-card border-r border-border h-screen sticky top-0 px-4 py-6">
            <div className="flex items-center gap-3 px-3 mb-10">
                <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                    <Sprout className="text-primary w-6 h-6" />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight">SmartFarm SaaS</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href} className="block relative">
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            <div
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative z-10 font-medium text-sm',
                                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}
                            >
                                <link.icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                                {link.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Settings2 className="w-5 h-5 text-primary" />
                        <h4 className="text-sm font-semibold text-foreground">Pro Plan</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">You are using 75% of your available API calls for AI Scanning.</p>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-primary rounded-full" />
                    </div>
                    <Link href="/pricing" className="text-xs text-primary font-bold mt-3 block hover:underline">
                        Upgrade Plan &rarr;
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
