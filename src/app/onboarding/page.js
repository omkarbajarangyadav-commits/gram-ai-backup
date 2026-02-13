'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "Heal Your Crop",
        desc: "Take a photo of your sick plant and get instant diagnosis & treatment.",
        color: "bg-green-100 text-green-600",
        icon: "📸"
    },
    {
        id: 2,
        title: "Expert Community",
        desc: "Ask questions to agriculture experts and connect with other farmers.",
        color: "bg-blue-100 text-blue-600",
        icon: "👨‍🌾"
    },
    {
        id: 3,
        title: "Market Prices",
        desc: "Get live market rates (Mandi bhav) for all your crops daily.",
        color: "bg-purple-100 text-purple-600",
        icon: "📈"
    }
];

export default function Onboarding() {
    const [current, setCurrent] = useState(0);
    const router = useRouter();

    const next = () => {
        if (current < slides.length - 1) {
            setCurrent(current + 1);
        } else {
            router.push('/language');
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col justify-between p-6 relative overflow-hidden">

            {/* Background Blob */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-80 h-80 bg-green-50 rounded-full blur-3xl -z-10"
            />

            <div className="flex-1 flex flex-col justify-center items-center text-center mt-10">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-xs"
                    >
                        <div className={`w-64 h-64 mx-auto ${slides[current].color} rounded-[3rem] flex items-center justify-center mb-10 shadow-lg`}>
                            <span className="text-8xl">{slides[current].icon}</span>
                        </div>

                        <h2 className="text-3xl font-extrabold text-slate-800 mb-4 leading-tight">
                            {slides[current].title}
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {slides[current].desc}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full mt-10">
                {/* Indicators */}
                <div className="flex justify-center gap-2 mb-8">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-green-600' : 'w-2 bg-slate-200'}`}
                        />
                    ))}
                </div>

                {/* Action Button */}
                <button
                    onClick={next}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                    <span>{current === slides.length - 1 ? "Get Started" : "Next"}</span>
                    <ArrowRight size={20} />
                </button>
            </div>

        </main>
    );
}
