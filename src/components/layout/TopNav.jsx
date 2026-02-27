'use client';
import { Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="h-20 bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-xl">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative hidden md:flex items-center">
                    <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search fields, crop status..."
                        className="pl-10 pr-4 py-2 w-72 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm transition-all text-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 text-muted-foreground hover:bg-muted rounded-full relative transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
                    </button>
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-80 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
                            >
                                <div className="p-4 border-b border-border flex justify-between items-center">
                                    <h3 className="font-semibold text-sm">Notifications</h3>
                                    <button className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {[
                                        { title: 'Irrigation Needed', desc: 'Field A soil moisture dropped to 15%.', time: '5m ago' },
                                        { title: 'AI Scan Result', desc: 'Powdery Mildew detected with 94% confidence.', time: '2h ago' },
                                    ].map((notif, i) => (
                                        <div key={i} className="p-4 hover:bg-muted/50 border-b border-border last:border-0 cursor-pointer transition-colors">
                                            <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{notif.desc}</p>
                                            <span className="text-[10px] text-muted-foreground/80 mt-2 block">{notif.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-10 w-10 min-w-10 rounded-full border-2 border-primary/20 overflow-hidden cursor-pointer hover:border-primary transition-colors">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
}
