'use client';
import { motion } from 'framer-motion';
import { Droplets, Sprout, TrendingUp, AlertTriangle, Bug, CloudSun } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Yield Data
const yieldData = [
    { month: 'Jan', yield: 12 }, { month: 'Feb', yield: 19 },
    { month: 'Mar', yield: 24 }, { month: 'Apr', yield: 30 },
    { month: 'May', yield: 35 }, { month: 'Jun', yield: 50 },
];

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground flex items-center gap-2">
                        Overview <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold ml-2">Pro</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Welcome back! Here's what's happening on your farms today.</p>
                </div>

                <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-sm">
                    <button className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-md">Today</button>
                    <button className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/50 rounded-xl transition-colors">7D</button>
                    <button className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/50 rounded-xl transition-colors">30D</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Farm Area', value: '45.2 Ha', icon: Sprout, trend: '+2.5% this month', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Est. Yield', value: '1,280 Tons', icon: TrendingUp, trend: '+14% vs last year', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Avg Moisture', value: '32%', icon: Droplets, trend: '-2% (Needs Water)', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Pest Alerts', value: '3 Active', icon: Bug, trend: 'Requires Attention', color: 'text-destructive', bg: 'bg-destructive/10' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-card p-6 rounded-3xl border border-border/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl ${stat.bg} group-hover:scale-150 transition-transform duration-500`} />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                            <div className={`p-2 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight mb-2 relative z-10">{stat.value}</h3>
                        <p className="text-xs font-medium text-muted-foreground relative z-10">{stat.trend}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Yield Projection Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-gradient-to-br from-card to-card hover:to-muted/10 p-6 rounded-3xl border border-border shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden group"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Yield Projection</h2>
                            <p className="text-sm font-medium text-muted-foreground">Estimated growth across all fields</p>
                        </div>
                        <button className="text-sm font-bold text-primary hover:underline group-hover:pr-2 transition-all">Details &rarr;</button>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={yieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="yield" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* AI Action Center */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card p-6 rounded-3xl border border-border shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mt-10 -mr-10"></div>
                    <h2 className="text-lg font-bold text-foreground mb-1 relative z-10">AI Action Center</h2>
                    <p className="text-sm font-medium text-muted-foreground mb-6 relative z-10">Immediate recommendations</p>

                    <div className="space-y-4 relative z-10">
                        {[
                            { title: 'Irrigate Sector 4', desc: 'Moisture critically low. 50L needed.', icon: AlertTriangle, status: 'critical', ring: 'ring-destructive/20', bg: 'bg-destructive/10', color: 'text-destructive' },
                            { title: 'Apply Fungicide', desc: 'High risk of Rust observed in Tomato.', icon: Bug, status: 'warning', ring: 'ring-amber-500/20', bg: 'bg-amber-500/10', color: 'text-amber-500' },
                            { title: 'Harvest Ready', desc: 'Soybean moisture optimal for harvest.', icon: Sprout, status: 'good', ring: 'ring-emerald-500/20', bg: 'bg-emerald-500/10', color: 'text-emerald-500' }
                        ].map((action, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-background border border-border/50 hover:border-border transition-colors hover:shadow-lg hover:-translate-y-0.5 group">
                                <div className={`mt-1 h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${action.bg} ring-4 ${action.ring} group-hover:scale-110 transition-transform`}>
                                    <action.icon className={`w-5 h-5 ${action.color}`} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground mb-1">{action.title}</h4>
                                    <p className="text-xs font-medium text-muted-foreground mb-2 leading-relaxed">{action.desc}</p>
                                    <button className="text-[11px] font-extrabold uppercase tracking-wide text-primary hover:text-primary/80 transition-colors">Take Action</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

        </div>
    );
}
