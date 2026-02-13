'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [mobile, setMobile] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // In a real app, send OTP here.
        // In a real app, send OTP here.
        // For now, redirect to Role Selection
        router.push('/role');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-green-50 rounded-b-[3rem] -z-10"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="mb-10 text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-200">
                        <span className="text-4xl">🌱</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Smart Farm</h1>
                    <p className="text-slate-500 mt-2 font-medium">Your Digital Farming Assistant</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Welcome Back!</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold flex items-center gap-2 border-r border-slate-200 pr-2">
                                    <Phone size={16} />
                                    <span>+91</span>
                                </div>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-24 pr-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    placeholder="98765 43210"
                                    maxLength={10}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all"
                        >
                            <span>Get OTP</span>
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400">By continuing, you agree to our Terms & Privacy Policy.</p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
