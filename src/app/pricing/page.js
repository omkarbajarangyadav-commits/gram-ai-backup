'use client';
import { useState } from 'react';
import { Check, Info, Shield, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Free',
        desc: 'Perfect for small household farms.',
        price: '₹0',
        frequency: 'forever',
        features: ['1 Farm Managed', '5KM Radar Job Radius', 'Basic Weather Forecast', 'Community Help'],
        disabledFeatures: ['10KM Premium Radar Radius', 'AI Priority Job Dispatch', 'Unlimited AI Disease Scans', 'Smart Irrigation Engine'],
        buttonText: 'Current Plan',
        buttonClass: 'bg-muted text-muted-foreground border border-border cursor-not-allowed pointer-events-none',
        glow: false
    },
    {
        name: 'Pro Farmer',
        desc: 'Advanced spatial tools to maximize your yield & income.',
        price: '₹599',
        frequency: '/month',
        features: ['10KM Radar Geo-Radius', 'AI Priority Job Dispatch (+50 Boost)', 'Unlimited AI Disease Scans', 'Smart Irrigation Engine (ET0)', 'Live Premium Market Data'],
        disabledFeatures: ['Agronomist Dashboard', 'Multi-tenant client views'],
        buttonText: 'Upgrade with Razorpay',
        buttonClass: 'bg-primary text-primary-foreground shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] active:scale-95 transition-all',
        glow: true,
        badge: 'MOST POPULAR'
    },
    {
        name: 'Agronomist Enterprise',
        desc: 'For consultants managing multiple clients.',
        price: '₹2,999',
        frequency: '/month',
        features: ['Unlimited Farms & Clients', 'Advanced Client Reporting', 'Branded Disease Scan PDF Reports', 'Priority Phone Support', 'API Access'],
        disabledFeatures: [],
        buttonText: 'Contact Sales',
        buttonClass: 'bg-card text-foreground border-2 border-primary/20 hover:border-primary transition-colors',
        glow: false
    }
];

export default function PricingPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleCheckout = async (planName) => {
        if (planName !== 'Pro Farmer') return; // Only mock checkout for Pro

        setLoading(true);
        setMessage(null);
        try {
            // Mocking a Razorpay / Stripe delay
            const res = await fetch('/api/subscribe', { method: 'POST' });

            if (res.ok) {
                setMessage("✅ Payment Successful! Krishi Radar 10KM & AI Boost Activated.");
                setTimeout(() => window.location.href = '/radar', 2000); // Redirect to new map
            } else {
                setMessage("❌ Checkout Failed. Please login first.");
            }
        } catch (e) {
            setMessage("❌ Network Error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-16 pb-32 animate-in fade-in duration-700 min-h-screen">

            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">Invest in Your <span className="text-primary">Yield</span></h1>
                <p className="text-muted-foreground text-lg">Predictable pricing to unlock 10KM Radar ranges, AI priority job dispatch, and smart crop scanning.</p>
                <div className="flex items-center justify-center gap-6 mt-8 p-4 bg-primary/5 rounded-2xl mx-auto w-fit">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Check className="w-5 h-5 text-primary" /> Secure Razorpay</div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Check className="w-5 h-5 text-primary" /> Cancel anytime</div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Shield className="w-5 h-5 text-primary" /> 14-day refund</div>
                </div>

                {message && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-slate-900 border border-slate-700 rounded-xl max-w-md mx-auto text-emerald-400 font-bold shadow-2xl">
                        {message}
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                {plans.map((plan, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={plan.name}
                        className={`relative p-8 rounded-[2rem] bg-card border flex flex-col pt-10 ${plan.glow ? 'border-primary/50 shadow-2xl md:scale-105 z-10' : 'border-border shadow-md mt-4 md:mt-6'}`}
                    >
                        {plan.badge && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-black tracking-widest flex items-center gap-1">
                                <Zap className="w-3 h-3" /> {plan.badge}
                            </div>
                        )}

                        <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mt-2 mb-6 min-h-[40px]">{plan.desc}</p>

                        <div className="mb-8 flex items-end gap-1">
                            <span className="text-4xl font-black text-foreground">{plan.price}</span>
                            <span className="text-muted-foreground font-semibold pb-1">{plan.frequency}</span>
                        </div>

                        <button
                            onClick={() => handleCheckout(plan.name)}
                            disabled={loading && plan.name === 'Pro Farmer'}
                            className={`w-full py-4 flex items-center justify-center gap-2 rounded-xl font-bold mb-8 ${plan.buttonClass}`}
                        >
                            {loading && plan.name === 'Pro Farmer' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                            {plan.buttonText}
                        </button>

                        <div className="space-y-4 flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">What's included</p>
                            {plan.features.map(f => (
                                <div key={f} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm font-semibold text-foreground">{f}</span>
                                </div>
                            ))}
                            {plan.disabledFeatures.map(f => (
                                <div key={f} className="flex items-start gap-3 opacity-40">
                                    <Info className="w-5 h-5 text-muted-foreground shrink-0" />
                                    <span className="text-sm font-medium text-muted-foreground line-through">{f}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
}
